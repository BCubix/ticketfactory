<?php

namespace App\Repository;

use App\Entity\Event\EventDateBlock;
use Doctrine\Persistence\ManagerRegistry;

class EventDateBlockRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventDateBlock::class);
    }
}