<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Manager\VersionnedEntityManager;

class EventHook
{
    private $vem;

    public function __construct(VersionnedEntityManager $vem)
    {
        $this->vem = $vem;
    }

    public function hookEventSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        //$this->vem->checkVersionnedEntity($sObject, $iObject);
    }
}
