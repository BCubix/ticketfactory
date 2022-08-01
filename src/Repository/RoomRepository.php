<?php

namespace App\Repository;

use App\Entity\Room;

use Doctrine\Persistence\ManagerRegistry;

class RoomRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Room::class);
    }
}
