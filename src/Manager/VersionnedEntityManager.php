<?php

namespace App\Manager;

use App\Entity\Content\Content;
use App\Entity\Page\Page;
use App\Entity\Page\PageBlockType;
use App\Entity\VersionnedEntity\VersionnedEntity;
use App\Exception\ApiException;

use Doctrine\Common\Util\ClassUtils;
use Symfony\Component\HttpFoundation\Response;

class VersionnedEntityManager extends AbstractManager
{
    public const SERVICE_NAME = 'versionnedEntity';

    private const SUPPORTED_TYPES = [
        'content' => Content::class,
        'page'    => Page::class
    ];

    protected $parsedObjects = [];

    public function checkVersionnedEntity(Object $newEntity, Object $oldEntity): void
    {
        if (null === $this->getKeyword($newEntity)) {
            return;
        }

        $oldEntityCompareArray = $oldEntity->toStringToCompare();
        $newEntityCompareArray = $newEntity->toStringToCompare();

        $changeSet = $this->compareObjects($newEntityCompareArray, $oldEntityCompareArray);
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
        $versions = $this->em->getRepository(VersionnedEntity::class)->findEntityVersionsForAdmin($entityKeyword, $entityId);
        foreach ($versions as &$version) {
            $version = $this->deSerializeVersionnedEntity($version);
        }

        return $versions;
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

        return $object;
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

    public function deSerializeVersionnedEntity(VersionnedEntity $entity)
    {
        if ($entity->getEntityKeyword() !== "page") {
            return $entity;
        }

        $page = $this->em->getRepository(Page::class)->find($entity->getEntityId());
        if (null === $page || !isset($entity->getFields()['pageBlocks'])) {
            return $entity;
        }

        $pagePageBlocks = $page->getPageBlocks()->toArray();
        $fields = $entity->getFields();
        foreach ($fields['pageBlocks'] as $key => &$pageBlock) {
            if (isset($pageBlock['fields']) && isset($pagePageBlocks[$key]) && null !== $pagePageBlocks[$key]->getPageBlockType()) {
                $pageBlockType = $pagePageBlocks[$key]->getPageBlockType();

                foreach ($pageBlock['fields'] as $contentFieldName => &$contentField) {
                    foreach ($pageBlockType->getFields() as $pageBlockTypeField) {
                        if ($contentFieldName == $pageBlockTypeField->getName()) {
                            $component = $this->mf->get('contentType')->getContentTypeInstanceFromType($pageBlockTypeField->getType());

                            if (method_exists($component, "jsonContentDeserialize")) {
                                $contentField = $component->jsonContentDeserialize($contentField, $pageBlockTypeField);
                            } else {
                                $contentField = $contentField;
                            }

                            break;
                        }
                    }
                }

                continue;
            }

            if (!isset($pageBlock['columns'])) {
                continue;
            }

            $pagePageColumns = [];
            if (isset($pagePageBlocks[$key])) {
                $pagePageColumns = $pagePageBlocks[$key]->getColumns() ?? [];
            }

            foreach ($pageBlock['columns'] as $columnKey => &$column) {
                if (isset($column['content']) && isset($pagePageColumns[$columnKey])) {
                    $typeInstance = $this->mf->get('page')->getPageColumnInstanceFromType($pagePageColumns[$columnKey]->getType());
                    if (method_exists($typeInstance, "jsonContentDeserialize")) {
                        $column['content'] = $typeInstance->jsonContentDeserialize($column['content']);
                    }
                }
            }
        }

        $entity->setFields($fields);

        return $entity;
    }

    protected function compareObjects($newObject, $oldObject): mixed
    {
        $changeSet = [];

        if (!is_array($newObject) || !is_array($oldObject)) {
            return $newObject !== $oldObject ? $oldObject : [];
        }

        foreach ($oldObject as $key => $oldObjectElement) {
            if (!array_key_exists($key, $newObject)) {
                $changeSet[$key] = $oldObjectElement;
            }

            if (is_array($newObject[$key]) || is_array($oldObject[$key])) {
                if (is_array($newObject[$key]) && is_array($oldObject[$key])) {
                    foreach ($oldObject[$key] as $oldObjectKeyIndex => $oldObjectKeyElement) {
                        if (!array_key_exists($oldObjectKeyIndex, $newObject[$key])) {
                            $changeSet[$key][$oldObjectKeyIndex] = $oldObjectKeyElement;
                        } else {
                            $result = $this->compareObjects($newObject[$key][$oldObjectKeyIndex], $oldObjectKeyElement);
                            if (!empty($result)) {
                                $changeSet[$key][$oldObjectKeyIndex] = $result;
                            }
                        }
                    }
                } else {
                    $changeSet[$key] = $oldObject[$key];
                }
            } else if (is_object($newObject[$key]) && is_object($oldObject[$key])) {
                $result = $this->compareObjects($newObject[$key], $oldObject[$key]);
                if (!empty($result)) {
                    $changeSet[$key] = $result;
                }
            } else {
                if ($newObject[$key] !== $oldObject[$key]) {
                    $changeSet[$key] = $oldObject[$key];
                }
            }
        }

        return $changeSet;
    }

    private function restoreFieldsVersion(Object &$object, array $fields): void
    {
        $keyword = $this->getKeyword($object);
        if ($keyword === 'page') {
            $this->restorePageVersion($object, $fields);
        }

        $this->em->persist($object);
        $this->em->flush();
    }

    private function restorePageVersion(Object &$object, array $fields): void
    {
        foreach($object->getPageBlocks() as &$pageBlock) {
            $this->sf->get('pageBlockSerializer')->serializePageBlock($pageBlock);
        }

        $object->restoreHistory($fields);

        foreach($object->getPageBlocks() as &$pageBlock) {
            $this->sf->get('pageBlockSerializer')->deSerializePageBlock($pageBlock);
        }
    }
}
