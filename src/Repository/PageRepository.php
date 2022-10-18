<?php

namespace App\Repository;

use App\Entity\Page\Page;

use Doctrine\Persistence\ManagerRegistry;

class PageRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['title', 'o.title', 'search']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'title' => 'o.title'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Page::class);
    }
}
