<?php

namespace App\Hook;

use App\Entity\Event\EventCategory;
use App\Entity\Media\MediaCategory;
use App\Event\HookEvent;
use App\Service\Addon\Hook;

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
}
