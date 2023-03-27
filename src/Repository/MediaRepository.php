<?php

namespace App\Repository;

use App\Utils\MimeTypeMapping;
use App\Entity\Media\Media;

use Doctrine\Persistence\ManagerRegistry;

class MediaRepository extends CrudRepository
{
    protected const SELECTS = [
        'ec' => null,
    ];

    protected const JOINS = [
        ['leftJoin', 'o.mediaCategories', 'ec'],
    ];

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['iframe', 'o.iframe', 'equals'],
        ['category', 'ec.id', 'in'],
        ['title', 'o.title', 'search'],
        ['type', 'o.documentType', 'in'],
        ['category', 'ec.id', 'in'],
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

    public function findByTypeForAdmin(string $type)
    {
        $mimes = MimeTypeMapping::getMimesFromType($type);

        return $this->createQueryBuilder('m')
            ->where('m.documentType IN (:mimes)')
            ->setParameter('mimes', $mimes)
            ->getQuery()
            ->getResult()
        ;
    }
}
