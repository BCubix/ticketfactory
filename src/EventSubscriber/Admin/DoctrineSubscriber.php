<?php

namespace App\EventSubscriber\Admin;

use App\Entity\JsonDoctrineSerializable;

use Doctrine\Common\EventSubscriber;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;

class DoctrineSubscriber implements EventSubscriber
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getSubscribedEvents()
    {
        // return the subscribed events, their methods and priorities
        return [
            Events::prePersist,
            Events::preUpdate,
            Events::postLoad
        ];
    }

    public function prePersist($args): void
    {
        $entity = $args->getEntity();

        if ($entity instanceof (JsonDoctrineSerializable::class)) {
            $entity->jsonSerialize();
        }
    }

    public function preUpdate($args): void
    {
        $entity = $args->getEntity();
        if ($entity instanceof (JsonDoctrineSerializable::class)) {
            $entity->jsonSerialize();
        }
    }

    public function postLoad($args): void
    {
        $entity = $args->getEntity();
        if ($entity instanceof (JsonDoctrineSerializable::class)) {
            $className = get_class($entity);
            $className::jsonDeserialize($entity);
        }
    }
}
