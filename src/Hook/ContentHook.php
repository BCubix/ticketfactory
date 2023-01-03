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

    public function hookContentValidated(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $vObject = $event->getParam('vObject');

        $this->vem->checkVersionnedEntity($vObject, $iObject);
    }
}
