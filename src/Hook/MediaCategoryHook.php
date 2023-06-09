<?php

namespace App\Hook;

use App\Entity\Media\MediaCategory;
use App\Event\HookEvent;
use App\Service\Addon\Hook;

class MediaCategoryHook extends Hook
{
    public function hookEventCategorySaved(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'add') {
            return;
        }

        $mediaCategory = $event->getParam('sObject');
        $parentId = $mediaCategory->getParent()->getId();
        
        if ($mediaCategory->getPosition() > 0) {
            return;
        }

        $maxPosition = $this->em->getRepository(MediaCategory::class)->findMaxPositionForAdmin($parentId);

        if (null === $maxPosition || count($maxPosition) === 0) {
            $mediaCategory->setPosition(1);
        } else {
            $mediaCategory->setPosition($maxPosition[0]->getPosition() + 1);
        }

        $this->em->persist($mediaCategory);
        $this->em->flush();
    }
}
