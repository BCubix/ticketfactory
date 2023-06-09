<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;

use Symfony\Component\HttpFoundation\Response;

class SeasonHook extends Hook
{
    public function hookSeasonInstantiated(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'delete') {
            return;
        }

        $season = $event->getParam('object');
        if (count($season->getEvents()) > 0) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer cette saison car des événements y sont rattachés.');
        }
    }
}
