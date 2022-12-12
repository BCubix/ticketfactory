<?php

namespace App\Repository;

use App\Entity\Page\PageBlock;

use Doctrine\Persistence\ManagerRegistry;

class PageBlockRepository extends CrudRepository
{
    protected const FILTERS = [
        ['name', 'o.name', 'search'],
        ['saveAsModel', 'o.saveAsModel', 'equals']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PageBlock::class);
    }
}
