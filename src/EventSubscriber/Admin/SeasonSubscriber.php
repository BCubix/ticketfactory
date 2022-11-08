<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Event\Season;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class SeasonSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            CrudObjectInstantiatedEvent::NAME => [['onSeasonInstantiate', 0]]
        ];
    }

    public function onSeasonInstantiate(CrudObjectInstantiatedEvent $event)
    {
        $season = $event->getObject();
        if (!$this->isSupported($season)) {
            return;
        }

        if ($event->getState() !== 'delete') {
            return;
        }

        if (count($season->getEvents()) > 0) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer cette saison car des événements y sont rattachés.');
        }
    }

    private function isSupported(Object $object)
    {
        return (gettype($object) == "object" && get_class($object) == Season::class);
    }
}
