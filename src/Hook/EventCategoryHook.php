<?php

namespace App\Hook;

use App\Entity\Event\EventCategory;
use App\Event\HookEvent;
use App\Exception\ApiException;


use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class EventCategoryHook
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

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
}
