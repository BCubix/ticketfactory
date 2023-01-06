<?php

namespace App\Hook;

use App\Event\Admin\HookEvent;
use App\Manager\ImageFormatManager;

class MediaHook
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