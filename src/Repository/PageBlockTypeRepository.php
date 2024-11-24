<?php

namespace App\Repository;

use App\Entity\Page\PageBlockType;

use Doctrine\Persistence\ManagerRegistry;

class PageBlockTypeRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PageBlockType::class);
    }
}
