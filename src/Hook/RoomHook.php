<?php

namespace App\Hook;

use App\Entity\Event\Room;
use App\Event\Admin\HookEvent;
use App\Exception\ApiException;

use Symfony\Component\HttpFoundation\Response;

class RoomHook
{
    public function hookRoomInstantiated(HookEvent $event)
    {
        $room = $event->getParam('object');
        if (count($room->getEvents()) > 0) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer cette salle car des événements y sont rattachés.');
        }
    }
}
