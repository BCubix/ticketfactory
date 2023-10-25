<?php

namespace App\Hook;

use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;
use App\Entity\Parameter\Parameter;
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
    public function suppressImageFormat(Media $mediaIobject, Media $mediaSobject)
    {

        $mediaSobjectImageFormat = $mediaSobject->getImageFormats();
        $mediaIobjectImageFormat = $mediaIobject->getImageFormats();
        $suppressArray = [];
        foreach ($mediaIobjectImageFormat->toArray() as $imageFormatmediaIobject) {
            $i = false;
            foreach ($mediaSobjectImageFormat->toArray() as $imageFormatmediaSobject) {
                if ($imageFormatmediaSobject->getId() === $imageFormatmediaIobject) {
                    $i = true;
                    break;
                }
            }
            if ($i != true) {
                $suppressArray[] = $imageFormatmediaIobject;
            }
        }
        $this->ifm->deleteThumbnails(['results' => $suppressArray], [$mediaSobject]);
    }

    public function addImageFormat(Media $mediaIobject, Media $mediaSobject)
    {

        $mediaSobjectImageFormat = $mediaSobject->getImageFormats();
        $mediaIobjectImageFormat = $mediaIobject->getImageFormats();
        $addArray = [];
        foreach ($mediaSobjectImageFormat->toArray() as $imageFormatmediaSobject) {
            $i = false;
            foreach ($mediaIobjectImageFormat->toArray() as $imageFormatmediaIobject) {
                if ($imageFormatmediaIobject->getId() == $imageFormatmediaSobject->getId()) {
                    $i = true;
                    break;
                }
            }
            if ($i != true) {
                $addArray[] = $imageFormatmediaSobject;
            }
        }
        $this->ifm->generateThumbnails(['results' => $addArray], [$mediaSobject]);
    }
    public function mediaEdit(HookEvent $event)
    {
        $mediaIobject = $event->getParam('iObject');
        $mediaSobject = $event->getParam('sObject');
        $this->suppressImageFormat($mediaIobject, $mediaSobject);
        $this->addImageFormat($mediaIobject, $mediaSobject);
    }

    public function hookMediaSaved(HookEvent $event)
    {
        $media = $event->getParam('sObject');
        $formats = $event->getParam('formats');
        if ($event->getParam('iObject')) {
            $this->mediaEdit($event);
        } else {
            $this->ifm->generateThumbnails($formats, [$media]);
        }
    }
}