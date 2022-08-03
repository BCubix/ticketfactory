<?php

namespace App\Repository;

use App\Entity\EventCategory;

use Doctrine\Persistence\ManagerRegistry;

class EventCategoryRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventCategory::class);
    }
}
