<?php

namespace App\Hook;

use App\Entity\Event\Season;
use App\Event\Admin\HookEvent;
use App\Exception\ApiException;

use Symfony\Component\HttpFoundation\Response;

class SeasonHook
{
    public function hookSeasonInstantiated(HookEvent $event)
    {
        $season = $event->getParam('object');
        if (!$this->isSupported($season)) {
            return;
        }

        if ($event->getParam('state') !== 'delete') {
            return;
        }

        if (count($season->getEvents()) > 0) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer cette saison car des événements y sont rattachés.');
        }
    }

    private function isSupported(Object $object): bool
    {
        return (gettype($object) == "object" && get_class($object) == Season::class);
    }
}
