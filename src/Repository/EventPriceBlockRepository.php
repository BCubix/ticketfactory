<?php

namespace App\Repository;

use App\Entity\Event\EventPriceBlock;
use Doctrine\Persistence\ManagerRegistry;

class EventPriceBlockRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventPriceBlock::class);
    }
}