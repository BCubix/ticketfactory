<?php

namespace App\Hook;

use App\Entity\Event\EventCategory;
use App\Entity\Language\Language;
use App\Entity\Media\MediaCategory;
use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;
use Symfony\Component\HttpFoundation\Response;

class LanguageHook extends Hook
{
    public function hookLanguageSaved(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'add') {
            return;
        }

        $language = $event->getParam('sObject');

        $rootCategory = $this->em->getRepository(EventCategory::class)->findRootCategory();
        $newCategory = $this->mf->get('eventCategory')->translateCategory($rootCategory, $language->getId());
        $this->em->persist($newCategory);

        $mediaRootCategory = $this->em->getRepository(MediaCategory::class)->findRootCategory();
        $newMediaCategory = $this->mf->get('mediaCategory')->translateCategory($mediaRootCategory, $language->getId());
        $this->em->persist($newMediaCategory);

        /**
         * Ajouter un nouveau menu ???
         */

        $this->em->flush();
    }

    public function hookLanguageValidated(HookEvent $event)
    {
        $defaultLanguage = $this->em->getRepository(Language::class)->findDefaultForWebsite();
        $iObject = $event->getParam('iObject');
        $vObject = $event->getParam('vObject');


        if (!$vObject->isIsDefault() && (null === $defaultLanguage || $iObject->isIsDefault())) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, 'Vous devez obligatoirement avoir une langue active.');
        }

        if (null !== $iObject && $iObject->isIsDefault()) {
            return;
        }

        if (null !== $defaultLanguage) {
            $defaultLanguage->setIsDefault(false);

            $this->em->persist($defaultLanguage);
            $this->em->flush();
        }
    }
}
