<?php

namespace App\Repository;

use App\Entity\Technical\Redirection;

use Doctrine\Persistence\ManagerRegistry;

class RedirectionRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['redirectType', 'o.redirectType', 'equals'],
        ['redirectFrom', 'o.redirectFrom', 'search'],
        ['redirectTo', 'o.redirectTo', 'search']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'redirectType' => 'o.redirectType',
        'redirectFrom' => 'o.redirectFrom',
        'redirectTo' => 'o.redirectTo'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Redirection::class);
    }
}
