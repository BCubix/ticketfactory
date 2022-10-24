<?php

namespace App\Repository;

use App\Entity\Content\Content;

use Doctrine\Persistence\ManagerRegistry;

class ContentRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['title', 'o.title', 'search'],
        ['contentType', 'o.contentType', 'in']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'title' => 'o.title',
        'contentType' => 'o.contentType'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Content::class);
    }
}
