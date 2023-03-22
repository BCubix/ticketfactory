<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;

use Symfony\Component\HttpFoundation\Response;

class RoomHook
{
    public function hookRoomInstantiated(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'delete') {
            return;
        }

        $room = $event->getParam('object');
        if (count($room->getEvents()) > 0) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer cette salle car des événements y sont rattachés.');
        }
    }
}
