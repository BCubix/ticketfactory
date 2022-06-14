<?php

namespace App\Repository;

use App\Entity\EventDate;

use Doctrine\Persistence\ManagerRegistry;

class EventDateRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventDate::class);
    }
}
