<?php

namespace App\Manager;

use App\Entity\Event\Room;

class RoomManager extends AbstractManager
{
    public const SERVICE_NAME = 'room';

    public function getBySlug($slug): ?Room
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Room::class)->findBySlugForWebsite($languageId, $slug);
    }
}