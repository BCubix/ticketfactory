<?php

namespace App\Manager;

use App\Entity\Language\Language;

use Symfony\Component\Uid\Uuid;
use Doctrine\ORM\EntityManagerInterface;

class LanguageManager extends AbstractManager
{
    public function setTranslationsProperties($entity): void
    {
        if (property_exists($entity, "languageGroup") && null === $entity->getLanguageGroup()) {
            $uuid = Uuid::v1();
            $entity->setLanguageGroup($uuid);
        }

        if (property_exists($entity, "lang") && null === $entity->getLang()) {
            $defaultLanguage = $this->em->getRepository(Language::class)->findDefaultLanguageForAdmin();
            $entity->setLang($defaultLanguage);
        }
    }

    public function getAllTranslations($objects, $entityClass, $filters)
    {
        if (isset($objects['results'])) {
            $list = $objects['results'];
        } else {
            $list = $objects;
        }

        if (isset($filters['lang']) || count($list) === 0 || !property_exists($list[0], 'languageGroup')) {
            return $objects;
        }

        $results = [];
        $repository = $this->em->getRepository($entityClass);

        foreach($list as $element) {
            $results[] = $element;

            $translated = $repository->findTranslatedElementsForAdmin($element->getLanguageGroup()->toBinary());
            if (count($translated) > 0) {
                foreach($translated as $translatedElement) {
                    $results[] = $translatedElement;
                }
            }
        }

        if (isset($objects['results'])) {
            $objects['results'] = $results;
        } else {
            $objects = $results;
        }

        return $objects;
    }

    public function translateElement($object, $languageId)
    {
        $language = $this->em->getRepository(Language::class)->findOneForAdmin($languageId);
        if (null === $language) {
            return null;
        }

        if ($object->getLang()->getId() === $language->getId()) {
            $object->setLanguageGroup(null);
        }

        $object->setLang($language);

        self::setTranslationsProperties($object);

        return $object;
    }
}