<?php

namespace App\Manager;

use App\Entity\Event\EventType;
use App\Entity\Page\Page;

class EventTypeManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'eventType';

    protected const ENTITY_CLASS = EventType::class;

    protected function getContentLinkTab(): array
    {
        return [];
    }

    protected function getAttachedPage(): ?Page
    {
        return $this->mf->get('parameter')->getCoreParameter('page_eventType');
    }

    public function getBySlug($slug): ?EventType
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(EventType::class)->findBySlugForWebsite($languageId, $slug);
    }
}