<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Service\Addon\Hook;

class EventHook extends Hook
{
    public function hookEventSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        //$this->mf->get('versionnedEntity')->checkVersionnedEntity($sObject, $iObject);
    }
}
