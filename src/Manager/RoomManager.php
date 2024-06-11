<?php

namespace App\Manager;

use App\Entity\Event\Room;

class RoomManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'room';

    protected const ENTITY_CLASS = Room::class;

    public function getBySlug($slug): ?Room
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Room::class)->findBySlugForWebsite($languageId, $slug);
    }
}