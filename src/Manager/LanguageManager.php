<?php

namespace App\Manager;

use App\Entity\Language\Language;
use App\Service\Object\CloneObject;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Uid\Uuid;

class LanguageManager extends AbstractManager
{
    public const SERVICE_NAME = 'language';

    public function setTranslationsProperties(Object $entity): void
    {
        if (property_exists($entity, "languageGroup") && null === $entity->getLanguageGroup()) {
            $uuid = Uuid::v1();
            $entity->setLanguageGroup($uuid);
        }

        if (property_exists($entity, "lang") && null === $entity->getLang()) {
            $defaultLanguage = $this->em->getRepository(Language::class)->findDefaultForAdmin();
            $entity->setLang($defaultLanguage);
        }
    }

    public function duplicateElement(Object $entity): void
    {
        if (property_exists($entity, "languageGroup") && null !== $entity->getLanguageGroup()) {
            $uuid = Uuid::v1();
            $entity->setLanguageGroup($uuid);
        }
    }

    public function deleteTranslation(Object $entity, string $entityClass): void
    {
        if (!property_exists($entity, "languageGroup") || !property_exists($entity, "lang") || !$entity->getLang()->isIsDefault()) {
            return;
        }

        $list = $this->em->getRepository($entityClass)->findTranslatedElementsForAdmin([$entity->getLanguageGroup()->toBinary()], []);
        foreach($list as $element) {
            if (!$element->getLang()->isIsDefault()) {
                $this->em->remove($element);
            }
        }
    }

    public function getAllTranslations(array $objects, string $entityClass, array $filters): array
    {
        if (isset($objects['results'])) {
            $list = $objects['results'];
        } else {
            $list = $objects;
        }

        if (isset($filters['lang']) || count($list) === 0 || !property_exists($list[0], 'languageGroup')) {
            return $objects;
        }

        $languageGroupList = [];
        foreach($list as $element) {
            $languageGroupList[] = $element->getLanguageGroup()->toBinary();
        }

        $results = $this->em->getRepository($entityClass)->findTranslatedElementsForAdmin($languageGroupList, $filters);
        $newList = [];

        foreach($results as $result) {
            if (!$result->getLang()->isIsDefault()) {
                continue;
            }

            $newList[] = $result;
            $id = $result->getId();
            $languageGroup = $result->getLanguageGroup()->toBinary();

            $translatedElements = array_filter($results, function ($translated) use ($id, $languageGroup) {
                return $translated->getLanguageGroup()->toBinary() === $languageGroup && $translated->getId() !== $id;
            });

            foreach($translatedElements as $element) {
                $newList[] = $element;
            }
        }

        if (isset($objects['results'])) {
            $objects['results'] = $newList;
        } else {
            $objects = $newList;
        }

        return $objects;
    }

    public function translateElement(Object $object, int $languageId): ?Object
    {
        $language = $this->em->getRepository(Language::class)->findOneForAdmin($languageId);
        if (null === $language) {
            return null;
        }

        if ($object->getLang()->getId() === $language->getId()) {
            $object->setLanguageGroup(null);
        }

        $object->setLang($language);

        $object = self::translateSubElements($object, $language);
        self::setTranslationsProperties($object);

        return $object;
    }

    public function translateSubElements(Object $object, Language $language): ?Object
    {
        $languageId = $language->getId();
        $newObject = CloneObject::cloneObject($object);
        $reflect = new \ReflectionClass($newObject);
        $props = $reflect->getProperties();
        $className = $reflect->getName();

        foreach ($props as $prop) {
            $name = $prop->getName();

            $reflectionProperty = new \ReflectionProperty($className, $name);
            $reflectionProperty->setAccessible(true);

            $value = $reflectionProperty->getValue($newObject);
            $type = CloneObject::getVariableType($reflectionProperty);

            if ($name === "id") {
                $reflectionProperty->setValue($newObject, null);
            } else if ($type === 'OneToMany') {
                $reflectionProperty->setValue($newObject, new ArrayCollection());

                $methodName = 'add' . ucfirst(substr($name, 0, -1));
                if ($reflect->hasMethod($methodName)) {
                    foreach ($value as $subObj) {
                        $newElement = self::createTranslateSubElement($subObj, $language);
                        $newObject->$methodName($newElement);
                    }
                }
            } else if ($type === 'ManyToMany') {
                $reflectionProperty->setValue($newObject, new ArrayCollection());

                $methodName = 'add' . ucfirst(substr($name, 0, -1));
                if ($reflect->hasMethod($methodName)) {
                    foreach ($value as $subObj) {
                        $newElement = self::getTranslatedSubElement($subObj, $languageId);
                        if (null !== $newElement) {
                            $newObject->$methodName($newElement);
                        }
                    }
                }
            } else if (($type === "OneToOne" || $type === "ManyToOne") && $name !== "lang") {
                $newElement = self::getTranslatedSubElement($value, $languageId);
                $reflectionProperty->setValue($newObject, $newElement);
            }
        }

        return $newObject;
    }

    public function getTranslatedSubElement(?Object $object, int $languageId): ?Object
    {
        if (null === $object) {
            return null;
        }

        $newObject = CloneObject::cloneObject($object);
        $reflect = new \ReflectionClass($object);
        $className = $reflect->getName();

        if (!$reflect->hasMethod("getLang") || !$reflect->hasMethod("getLanguageGroup") || $newObject->getLang()->getId() === $languageId) {
            return $newObject;
        }

        $result = $this->em->getRepository($className)->findOneByLanguageForAdmin($languageId, $newObject->getLanguageGroup()->toBinary());
        if (null === $result) {
            return null;
        }

        return $result;
    }

    public function createTranslateSubElement(Object $object, Language $language): ?Object
    {
        $newObject = CloneObject::cloneObject($object);
        $reflect = new \ReflectionClass($object);

        if (!$reflect->hasMethod("getLang") || !$reflect->hasMethod("getLanguageGroup") || $newObject->getLang()->getId() === $language->getId()) {
            return $newObject;
        }

        $newObject->setLang($language);
        $newObject->setLanguageGroup(null);

        return self::translateSubElements($newObject, $language);
    }

    public function getLanguageFromLocale(string $locale): ?Language
    {
        return $this->em->getRepository(Language::class)->findByLocaleForWebsite($locale);
    }
}
