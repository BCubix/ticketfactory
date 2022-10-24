<?php

namespace App\Repository;

use App\Entity\Event\Room;

use Doctrine\Persistence\ManagerRegistry;

class RoomRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name',
        'seatsNb' => 'o.seatsNb',
        'area' => 'o.area'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Room::class);
    }
}
