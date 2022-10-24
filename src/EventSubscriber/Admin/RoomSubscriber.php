<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Event\Room;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class RoomSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            CrudObjectInstantiatedEvent::NAME => [['onRoomInstantiate', 0]]
        ];
    }

    public function onRoomInstantiate(CrudObjectInstantiatedEvent $event)
    {
        $room = $event->getObject();
        if (!$this->isSupported($room)) {
            return;
        }

        if ($event->getState() !== 'delete') {
            return;
        }

        if (count($room->getEvents()) > 0) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer cette salle car des événements y sont rattachés.');
        }
    }

    private function isSupported(Object $object)
    {
        return (gettype($object) == "object" && get_class($object) == Room::class);
    }
}
