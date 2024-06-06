<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;
use Symfony\Component\HttpFoundation\Response;

class PageHook extends Hook
{
    public function hookPageSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        //$this->mf->get('versionnedEntity')->checkVersionnedEntity($sObject, $iObject);
    }

    public function hookPageInstantiated(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'delete') {
            return;
        }

        $page = $event->getParam('object');
        if (null !== $page->getController()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer cette page car elle est rattaché à une action particulière.');
        }
    }
}
