<?php

namespace App\Hook;

use App\Entity\User\User;
use App\Event\Admin\HookEvent;
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

    public function onUserInstantiate(HookEvent $event)
    {
        $user = $event->getParam('object');
        if (!$this->isSupported($user)) {
            return;
        }

        if ($event->getParam('state') !== 'delete') {
            return;
        }

        $admins = $this->um->getAdminUsers();
        if (count($admins) == 1 && $admins[0]->getId() == $user->getId()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Impossible de supprimer le dernier compte administrateur.');
        }
    }

    public function onUserValidate(HookEvent $event)
    {
        $user = $event->getParam('object');
        if (!$this->isSupported($user)) {
            return;
        }

        $this->um->upgradePassword($user);
    }

    private function isSupported(Object $object): bool
    {
        return (gettype($object) == "object" && get_class($object) == User::class);
    }
}
