<?php

namespace App\Repository;

use App\Entity\Event;

use Doctrine\Persistence\ManagerRegistry;

class EventRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }
}
