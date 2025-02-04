<?php

namespace App\Hook;

use App\Entity\Order\SubscriptionRow;
use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;

use Symfony\Component\HttpFoundation\Response;

class SubscriptionHook extends Hook
{
    public function hookSubscriptionValidated(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'edit') {
            return;
        }

        $vObject = $event->getParam('vObject');
        $iObject = $event->getParam('iObject');

        if ($this->em->getRepository(SubscriptionRow::class)->countBySubscriptionId($vObject->getId()) == 0) {
            return;
        }

        if ($vObject->getDuration() < $iObject->getDuration()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de réduire la durée de l\'abonnement.');
        }

        if ($vObject->getEventNb() < $iObject->getEventNb()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de réduire le nombre d\'événements de l\'abonnement.');
        }

        foreach ($iObject->getEvents() as $event) {
            $exists = $vObject->getEvents()->exists(function ($key, $e) use ($event) {
                return $e->getId() === $event->getId();
            });
        
            if (!$exists) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer des événements de l\'abonnement.');
            }
        }
    }
}
