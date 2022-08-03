<?php

namespace App\Repository;

use App\Entity\EventDate;

use Doctrine\Persistence\ManagerRegistry;

class EventDateRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventDate::class);
    }
}
