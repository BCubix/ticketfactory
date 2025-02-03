<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;

use Symfony\Component\HttpFoundation\Response;

class UserHook extends Hook
{
    public function hookUserInstantiated(HookEvent $event)
    {
        $user = $event->getParam('object');
        $state = $event->getParam('state');

        if ($state === 'delete') {
            $check = $this->mf->get('user')->validateCriticalUsers($user, true);
            if (!$check) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer le dernier compte administrateur.');
            }
        }
    }

    public function hookUserValidated(HookEvent $event)
    {
        $user = $event->getParam('vObject');
        $state = $event->getParam('state');

        $this->mf->get('user')->upgradePassword($user);

        if ($state === 'edit') {
            $check = $this->mf->get('user')->validateCriticalUsers($user, false);
            if (!$check) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Vous devez avoir au moins un utilisateur ayant les droits nécessaires à la gestion des profils.");
            }
        }
    }
}
