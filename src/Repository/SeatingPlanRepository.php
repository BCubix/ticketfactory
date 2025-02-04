<?php

namespace App\Repository;

use App\Entity\Event\SeatingPlan;

use Doctrine\Persistence\ManagerRegistry;

class SeatingPlanRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const SELECTS = [
        'ec' => null,
    ];

    protected const JOINS = [
        ['leftJoin', 'o.eventCategories', 'ec'],
    ];

    protected const FILTERS = [

        ['category', 'ec.id', 'in'],
        ['name', 'o.name', 'search'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'category' => 'ec.name',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SeatingPlan::class);
    }
}
