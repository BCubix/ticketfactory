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
        $eventCategory = $event->getParam('object');
        if (!$this->isSupported($eventCategory)) {
            return;
        }

        if ($event->getParam('state') !== 'delete') {
            return;
        }

        if ($eventCategory->getRoot()->getId() == $eventCategory->getId()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer la catégorie racine.');
        }
    }

    private function isSupported(Object $object): bool
    {
        return (gettype($object) == "object" && get_class($object) == EventCategory::class);
    }
}
