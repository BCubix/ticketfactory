<?php

namespace App\Repository;

use App\Entity\Event\EventMedia;
use Doctrine\Persistence\ManagerRegistry;

class EventMediaRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventMedia::class);
    }
}