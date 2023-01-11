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
}
