<?php

namespace App\Repository;

use App\Entity\Event\EventPrice;
use Doctrine\Persistence\ManagerRegistry;

class EventPriceRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventPrice::class);
    }
}