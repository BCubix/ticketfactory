<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Event\EventCategory;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;
use App\Manager\EventCategoryManager;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class EventCategorySubscriber implements EventSubscriberInterface
{
    private $ecm;

    public function __construct(EventCategoryManager $ecm)
    {
        $this->ecm = $ecm;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            CrudObjectInstantiatedEvent::NAME => [['onEventCategoryInstantiate', 0]]
        ];
    }

    public function onEventCategoryInstantiate(CrudObjectInstantiatedEvent $event)
    {
        $eventCategory = $event->getObject();
        if (!$this->isSupported($eventCategory)) {
            return;
        }

        if ($event->getState() !== 'delete') {
            return;
        }

        if ($eventCategory->getRoot()->getId() == $eventCategory->getId()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer la catégorie racine.');
        }
    }

    private function isSupported(Object $object)
    {
        return (gettype($object) == "object" && get_class($object) == EventCategory::class);
    }
}
