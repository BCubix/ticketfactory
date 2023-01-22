<?php

namespace App\Repository;

use App\Entity\Event\SeatingPlan;

use Doctrine\Persistence\ManagerRegistry;

class SeatingPlanRepository extends CrudRepository
{
    protected const FILTERS = [
        ['name', 'o.name', 'search']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SeatingPlan::class);
    }
}
