<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;

use Symfony\Component\HttpFoundation\Response;

class ImageFormatHook extends Hook
{
    public function hookImageFormatInstantiated(HookEvent $event)
    {
        $imageFormat = $event->getParam('object');
        $state = $event->getParam('state');

        if ($state !== 'delete') {
            return;
        }

        $result = $this->mf->get('imageFormat')->deleteThumbnails([ 'results' => [ $imageFormat] ]);
        if (!$result) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Une erreur s'est produite lors de la suppression du format d'images : " . $imageFormat->getName());
        }
    }
}
