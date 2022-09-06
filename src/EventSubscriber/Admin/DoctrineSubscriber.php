<?php

namespace App\EventSubscriber\Admin;

use App\Entity\ContentType;
use App\Entity\JsonDoctrineSerializable;

use Doctrine\Common\EventSubscriber;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;

class DoctrineSubscriber implements EventSubscriber
{
    public function getSubscribedEvents()
    {
        // return the subscribed events, their methods and priorities
        return [
            Events::prePersist,
            Events::preUpdate,
            Events::postLoad,
        ];
    }

    public function prePersist($args): void
    {
        $entity = $args->getEntity();
        if ($entity instanceof (ContentType::class)) {
            $this->serialize($entity);
        }
    }

    public function preUpdate($args): void
    {
        $entity = $args->getEntity();
        if ($entity instanceof (ContentType::class)) {
            $this->serialize($entity);
        }
    }

    public function postLoad($args): void
    {
        $entity = $args->getEntity();
        if ($entity instanceof (ContentType::class)) {
            $this->unserialize($entity);
        }
    }

    private function serialize(object $entity)
    {
        $newFields = [];
        foreach ($entity->getFields() as $field) {
            $newFields[] = $field->jsonSerialize();
        }

        $entity->setFields($newFields);
    }

    private function deserialize(object $entity)
    {
        $newFields = [];
        foreach ($entity->getFields() as $field) {
            $newFields[] = ContentType::jsonUnserialize($field);
        }

        $entity->setFields($newFields);
    }
}
