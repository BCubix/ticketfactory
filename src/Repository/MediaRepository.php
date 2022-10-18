<?php

namespace App\Repository;

use App\Entity\Media\Media;

use Doctrine\Persistence\ManagerRegistry;

class MediaRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['title', 'o.title', 'search'],
        ['documentType', 'o.documentType', 'in']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'title' => 'o.title',
        'documentType' => 'o.documentType',
        'documentSize' => 'o.documentSize'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Media::class);
    }
}
