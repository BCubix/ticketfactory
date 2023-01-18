<?php

namespace App\Hook;

use App\Entity\Event\EventCategory;
use App\Event\Admin\HookEvent;
use App\Exception\ApiException;


use Symfony\Component\HttpFoundation\Response;

class EventCategoryHook
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
}
