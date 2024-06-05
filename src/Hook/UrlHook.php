<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;
use Symfony\Component\HttpFoundation\Response;

class UrlHook extends Hook
{
    public function hookUrlValidated(HookEvent $event)
    {
        $vObject = $event->getParam('vObject');

        if (!str_contains($vObject->getSlug(), "%slug%") && !str_contains($vObject->getSlug(), "%id%") && $vObject->getKeyword() !== "event-list") {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Le slug doit inclure au moins %slug% ou %id%.');
        }
    }
}
