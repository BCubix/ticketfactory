<?php

namespace App\Manager;

use App\Entity\Event\Room;
use App\Entity\Page\Page;

class RoomManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'room';

    protected const ENTITY_CLASS = Room::class;

    public function getAttachedPage(): ?Page
    {
        return $this->mf->get('parameter')->getCoreParameter('page_room');
    }

    public function getBySlug($slug): ?Room
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Room::class)->findBySlugForWebsite($languageId, $slug);
    }
}