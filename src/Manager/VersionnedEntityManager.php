<?php

namespace App\Manager;

use App\Entity\Content\Content;
use App\Entity\Event\Event;
use App\Entity\Page\Page;
use App\Entity\VersionnedEntity\VersionnedEntity;
use App\Exception\ApiException;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Util\ClassUtils;
use Doctrine\ORM\UnitOfWork;
use Symfony\Component\HttpFoundation\Response;

class VersionnedEntityManager extends AbstractManager
{
    private const SUPPORTED_TYPES = [
        'content' => Content::class,
        'event'   => Event::class,
        'page'    => Page::class
    ];

    protected $parsedObjects = [];

    public function checkVersionnedEntity(Object $newEntity, Object $oldEntity): void
    {
        if (null === $this->getKeyword($newEntity)) {
            return;
        }

        $changeSet = $this->compareObjects($newEntity, $oldEntity);
        if (isset($changeSet['createdAt'])) {
            unset($changeSet['createdAt']);
        }
        if (isset($changeSet['updatedAt'])) {
            unset($changeSet['updatedAt']);
        }

        if (count($changeSet) > 0) {
            $this->createVersionnedEntity($newEntity, $changeSet);
        }
    }

    public function createVersionnedEntity(Object $entity, array $changeSet): void
    {
        if (null === $this->getKeyword($entity)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Ce type de données n'est pas géré.");
        }

        $ve = new VersionnedEntity();
        $ve->setEntityKeyword($this->getKeyword($entity));
        $ve->setEntityId($entity->getId());
        $ve->setRevisionDate(new \DateTime());
        $ve->setFields($changeSet);

        $this->em->persist($ve);
        $this->em->flush();
    }

    public function getEntityVersions(string $entityKeyword, int $entityId): array
    {
        return $this->em->getRepository(VersionnedEntity::class)->findEntityVersionsForAdmin($entityKeyword, $entityId);
    }

    public function restoreEntityVersion(string $entityKeyword, int $versionId): ?Object
    {
        $version = $this->em->getRepository(VersionnedEntity::class)->findEntityVersionForAdmin($entityKeyword, $versionId);
        if (!$version) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Cette version n'a pas été trouvée.");
        }

        $keyword = $this->getClass($version->getEntityKeyword());
        $object = $this->em->getRepository($keyword)->findOneForAdmin($version->getEntityId());

        $this->restoreFieldsVersion($object, $version->getFields());
    }

    public function getKeyword(?Object $entity): ?string
    {
        if (null === $entity) {
            return null;
        }

        $result = array_search(ClassUtils::getClass($entity), self::SUPPORTED_TYPES);
        if ($result === false) {
            return null;
        }

        return $result;
    }

    public function getClass(string $keyword): ?string
    {
        if (!isset(self::SUPPORTED_TYPES[$keyword])) {
            return null;
        }

        return self::SUPPORTED_TYPES[$keyword];
    }

    protected function compareObjects(Object $newEntity, Object $oldEntity): array
    {
        if (property_exists($newEntity, 'id')) {
            $key = $this->getKeyword($newEntity) . '-' . $newEntity->getId();
            if (false !== array_search($key, $this->parsedObjects)) {
                return [];
            }

            $this->parsedObjects[] = $key;
        }

        $changeSet = [];

        $reflectionObj = new \ReflectionClass($newEntity);
        $properties = $reflectionObj->getProperties();
        $className = $reflectionObj->getName();

        foreach ($properties as $property) {
            $propertyName = $property->getName();
            if ($propertyName == 'id') {
                continue;
            }

            $reflectionProperty = new \ReflectionProperty($className, $propertyName);
            $reflectionProperty->setAccessible(true);

            $oldValue = $reflectionProperty->getValue($oldEntity);
            $newValue = $reflectionProperty->getValue($newEntity);

            if (is_object($newValue)) {
                if ($newValue instanceof Collection) {
                    $childChangeSet = $this->compareCollections($newValue, $oldValue);
                } else {
                    $childChangeSet = $this->compareObjects($newValue, $oldValue);
                }

                if (count($childChangeSet) > 0) {
                    $changeSet[$propertyName] = $childChangeSet;
                }
            } elseif ($oldValue !== $newValue) {
                $changeSet[$propertyName] = ['before' => $oldValue, 'after' => $newValue];
            }
        }

        return $changeSet;
    }

    protected function compareCollections(Collection $newCollection, Collection $oldCollection): array
    {
        $changeSet = [];

        $refCollection = $newCollection;
        $othCollection = $oldCollection;
        $refIsNew = true;

        if (count($refCollection) < count($othCollection)) {
            $refCollection = $oldCollection;
            $othCollection = $newCollection;
            $refIsNew = false;
        }

        foreach ($refCollection as $key => $refElement) {
            $othElement = $othCollection->get($key);
            $newElement = ($refIsNew ? $refElement : $othElement);
            $oldElement = ($refIsNew ? $othElement : $refElement);

            if (gettype($oldElement) != gettype($newElement)) {
                $changeSet[] = ['before' => $oldElement, 'after' => $newElement];
                break;
            }

            if (is_object($newElement)) {
                if ($newElement instanceof Collection) {
                    $childChangeSet = $this->compareCollections($newElement, $oldElement);
                } else {
                    $childChangeSet = $this->compareObjects($newElement, $oldElement);
                }

                if (count($childChangeSet) > 0) {
                    $changeSet[] = $childChangeSet;
                }
                break;
            }

            if ($newElement != $oldElement) {
                $changeSet[] = ['before' => $newElement, 'after' => $oldElement];
                break;
            }
        }

        return $changeSet;
    }

    private function restoreFieldsVersion(Object &$object, array $fields): void
    {
        foreach ($fields as $fName => $fValues) {
            $reflectionProperty = new \ReflectionProperty(ClassUtils::getClass($object), $fName);
            $reflectionProperty->setAccessible(true);

            // Simple element
            if (isset($fValues['after'])) {
                $reflectionProperty->setValue($object, $fValues['after']);
                continue;
            }

            // Collection element
            $getMethod = 'get' . ucfirst(substr($fName, 0, -1)) . 's';
            foreach ($object->$getMethod() as &$childObject) {
                foreach ($fValues as $fValue) {
                    $this->restoreFieldsVersion($childObject, $fValue);
                    break;
                }
            }
        }
    }
}
