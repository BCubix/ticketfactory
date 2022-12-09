<?php

namespace App\EventSubscriber\Admin;

use App\Entity\User\User;
use App\Event\Admin\HookEvent;
use App\Exception\ApiException;
use App\Manager\UserManager;
use App\Service\Hook\HookService;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class UserSubscriber implements EventSubscriberInterface
{
    private $um;

    public function __construct(UserManager $um)
    {
        $this->um = $um;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            HookService::normalize('instantiated.' . User::class) => [['onUserInstantiate', 0]],
            HookService::normalize('validated.' . User::class) => [['onUserValidate', 0]]
        ];
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
