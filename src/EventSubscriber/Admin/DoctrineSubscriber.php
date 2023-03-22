<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Content\Content;
use App\Entity\Page\PageBlock;
use App\Entity\JsonDoctrineSerializable;
use App\Manager\LanguageManager;
use App\Service\Serializer\ContentSerializer;
use App\Service\Serializer\PageBlockSerializer;

use Doctrine\Common\Util\ClassUtils;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;

class DoctrineSubscriber implements EventSubscriber
{
    private $em;
    private $lm;
    private $cs;
    private $pbs;

    public function __construct(EntityManagerInterface $em, LanguageManager $lm, ContentSerializer $cs, PageBlockSerializer $pbs)
    {
        $this->em = $em;
        $this->lm = $lm;
        $this->cs = $cs;
        $this->pbs = $pbs;
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

        if (ClassUtils::getClass($entity) == Content::class) {
            $this->cs->serializeContent($entity);
        }

        if (ClassUtils::getClass($entity) == PageBlock::class) {
            $this->pbs->serializePageBlock($entity);
        }

        $this->lm->setTranslationsProperties($entity);
    }

    public function preUpdate($args): void
    {
        $entity = $args->getEntity();
        if ($entity instanceof (JsonDoctrineSerializable::class)) {
            $entity->jsonSerialize();
        }

        if (ClassUtils::getClass($entity) == Content::class) {
            $this->cs->serializeContent($entity);
        }

        if (ClassUtils::getClass($entity) == PageBlock::class) {
            $this->pbs->serializePageBlock($entity);
        }

        $this->lm->setTranslationsProperties($entity);
    }

    public function postLoad($args): void
    {
        $entity = $args->getEntity();
        if ($entity instanceof (JsonDoctrineSerializable::class)) {
            $className = get_class($entity);
            $className::jsonDeserialize($entity);
        }

        if (ClassUtils::getClass($entity) == Content::class) {
            $this->cs->deSerializeContent($entity);
        }

        if (ClassUtils::getClass($entity) == PageBlock::class) {
            $this->pbs->deSerializePageBlock($entity);
        }
    }
}
