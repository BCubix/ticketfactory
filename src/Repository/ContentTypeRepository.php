<?php

namespace App\Repository;

use App\Entity\Content\ContentType;

use Doctrine\Persistence\ManagerRegistry;

class ContentTypeRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
        ['pageType', 'o.pageType', 'equals'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContentType::class);
    }
}
