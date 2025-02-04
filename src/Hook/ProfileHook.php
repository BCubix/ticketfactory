<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;
use Symfony\Component\HttpFoundation\Response;

class ProfileHook extends Hook
{

    public function hookProfileInstantiated(HookEvent $event)
    {
        $profile = $event->getParam('object');
        $state = $event->getParam('state');

        if ($state === 'delete') {
            $check = $this->mf->get('profile')->validateCriticalRoles($profile, true);
            if (!$check) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Vous devez avoir au moins un profil ayant les droits nécessaires à la gestion des profils.");
            }
        }
    }

    public function hookProfileValidated(HookEvent $event)
    {
        $profile = $event->getParam('vObject');
        $state = $event->getParam('state');

        if ($state === 'edit') {
            $check = $this->mf->get('profile')->validateCriticalRoles($profile, false);
            if (!$check) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Vous devez avoir au moins un profil ayant les droits nécessaires à la gestion des profils.");
            }
        }
    }
}
