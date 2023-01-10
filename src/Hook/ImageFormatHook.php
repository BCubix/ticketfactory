<?php

namespace App\Hook;

use App\Event\Admin\HookEvent;
use App\Exception\ApiException;
use App\Manager\ImageFormatManager;

use Symfony\Component\HttpFoundation\Response;

class ImageFormatHook
{
    private $ifm;

    public function __construct(ImageFormatManager $ifm)
    {
        $this->ifm = $ifm;
    }

    public function hookImageFormatInstantiated(HookEvent $event)
    {
        $imageFormat = $event->getParam('object');
        $state = $event->getParam('state');

        if ($state !== 'delete') {
            return;
        }

        $result = $this->ifm->deleteThumbnails([ 'results' => [ $imageFormat] ]);
        if (!$result) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Une erreur s'est produite lors de la suppression du format d'images : " . $imageFormat->getName());
        }
    }
}