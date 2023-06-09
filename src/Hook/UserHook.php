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
        $admins = $this->mf->get('user')->getAdminUsers();

        if (count($admins) == 1 && $admins[0]->getId() == $user->getId()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer le dernier compte administrateur.');
        }
    }

    public function hookUserValidated(HookEvent $event)
    {
        $user = $event->getParam('vObject');
        $this->mf->get('user')->upgradePassword($user);
    }
}
