<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Manager\ImageFormatManager;
use App\Service\Addon\Hook;

class MediaHook extends Hook
{
    private $ifm;

    public function __construct(ImageFormatManager $ifm)
    {
        $this->ifm = $ifm;
    }
    
    public function hookMediaInstantiated(HookEvent $event)
    {
        $media = $event->getParam('object');
        $state = $event->getParam('state');

        if ($state !== 'delete') {
            return;
        }

        $this->ifm->deleteThumbnails(null, [$media]);
    }

    public function hookMediaSaved(HookEvent $event)
    {
        $media = $event->getParam('sObject');

        $this->ifm->generateThumbnails(null, [$media]);
    }
}
