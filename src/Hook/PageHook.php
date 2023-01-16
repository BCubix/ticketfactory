<?php

namespace App\Hook;

use App\Event\Admin\HookEvent;
use App\Manager\VersionnedEntityManager;

class PageHook
{
    private $vem;

    public function __construct(VersionnedEntityManager $vem)
    {
        $this->vem = $vem;
    }

    public function hookPageSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        //$this->vem->checkVersionnedEntity($sObject, $iObject);
    }
}
