<?php

namespace App\EventSubscriber\Admin;

use App\Entity\User\User;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;
use App\Manager\UserManager;

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
            CrudObjectInstantiatedEvent::NAME => [['onUserInstantiate', 0]],
            CrudObjectValidatedEvent::NAME => [['onUserValidate', 0]]
        ];
    }

    public function onUserInstantiate(CrudObjectInstantiatedEvent $event)
    {
        $user = $event->getObject();
        if (!$this->isSupported($user)) {
            return;
        }

        if ($event->getState() !== 'delete') {
            return;
        }

        // @TODO : Check at least one admin user still exists
    }

    public function onUserValidate(CrudObjectValidatedEvent $event)
    {
        $user = $event->getObject();
        if (!$this->isSupported($user)) {
            return;
        }

        $this->um->upgradePassword($user);
    }

    private function isSupported(Object $object)
    {
        return (gettype($object) == "object" && get_class($object) == User::class);
    }
}
