<?php

namespace App\Hook;

use App\Entity\User\User;
use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Manager\UserManager;

use Symfony\Component\HttpFoundation\Response;

class UserHook
{
    private $um;

    public function __construct(UserManager $um)
    {
        $this->um = $um;
    }

    public function hookUserInstantiated(HookEvent $event)
    {
        $user = $event->getParam('object');
        $admins = $this->um->getAdminUsers();

        if (count($admins) == 1 && $admins[0]->getId() == $user->getId()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer le dernier compte administrateur.');
        }
    }

    public function hookUserValidated(HookEvent $event)
    {
        $user = $event->getParam('vObject');
        $this->um->upgradePassword($user);
    }
}
