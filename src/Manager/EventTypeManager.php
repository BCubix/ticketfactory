<?php

namespace App\Manager;

use App\Entity\Event\EventType;

class EventTypeManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'eventType';

    protected const ENTITY_CLASS = EventType::class;

    public function getBySlug($slug): ?EventType
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(EventType::class)->findBySlugForWebsite($languageId, $slug);
    }
}