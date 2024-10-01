<?php

namespace App\Repository;

use App\Entity\ContactRequest\ContactRequest;

use App\Entity\Test\Test;
use Doctrine\Persistence\ManagerRegistry;

class TestRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const FILTERS = [
        ['ame', 'o.name', 'search']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Test::class);
    }
}
