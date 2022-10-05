<?php

namespace App\Repository;

use App\Entity\Event\Room;

use Doctrine\Persistence\ManagerRegistry;

class RoomRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Room::class);
    }
}
