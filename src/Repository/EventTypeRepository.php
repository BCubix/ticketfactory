<?php

namespace App\Repository;

use App\Entity\Event\EventType;
use Doctrine\Persistence\ManagerRegistry;

class EventTypeRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventType::class);
    }
}
