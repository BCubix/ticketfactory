<?php

namespace App\Hook;

use App\Event\Admin\HookEvent;
use App\Manager\VersionnedEntityManager;

class ContentHook
{
    private $vem;

    public function __construct(VersionnedEntityManager $vem)
    {
        $this->vem = $vem;
    }

    public function hookContentSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        $this->vem->checkVersionnedEntity($sObject, $iObject);
    }
}
