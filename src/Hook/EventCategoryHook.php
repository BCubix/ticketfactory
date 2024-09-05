<?php

namespace App\Hook;

use App\Entity\Event\EventCategory;
use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;

use Symfony\Component\HttpFoundation\Response;

class EventCategoryHook extends Hook
{
    public function hookEventCategoryInstantiated(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'delete') {
            return;
        }

        $eventCategory = $event->getParam('object');
        if ($eventCategory->getRoot()->getId() == $eventCategory->getId()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer la catégorie racine.');
        }
    }

    public function hookEventCategorySaved(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'add') {
            return;
        }

        $eventCategory = $event->getParam('sObject');
        $parentId = $eventCategory->getParent()->getId();

        if ($eventCategory->getPosition() > 0) {
            return;
        }

        $maxPosition = $this->em->getRepository(EventCategory::class)->findMaxPositionForAdmin($parentId);

        if (null === $maxPosition || count($maxPosition) === 0) {
            $eventCategory->setPosition(1);
        } else {
            $eventCategory->setPosition($maxPosition[0]->getPosition() + 1);
        }

        $this->em->persist($eventCategory);
        $this->em->flush();
    }

    public function hookEventCategoryValidated(HookEvent $event)
    {
        $vObject = $event->getParam('vObject');
        $eventCategoryId = $vObject->getId();

        $eventCategory = $vObject->getParent();
        while (null !== $eventCategory) {
            if ($eventCategory->getId() === $eventCategoryId) {
                throw  new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'La catégorie courante ne peut être située à plusieurs endroits dans l\'arborescence.');
            }
            $eventCategory = $eventCategory->getParent();
        }

        $this->mf->get('seo')->completeSeoEventCategory($vObject);
    }
}
