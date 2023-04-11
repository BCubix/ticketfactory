<?php

namespace App\Repository;

use App\Entity\Content\Content;

use Doctrine\Persistence\ManagerRegistry;

class ContentRepository extends CrudRepository
{
    protected const SELECTS = [
        'el' => null
    ];

    protected const JOINS = [
        ['leftJoin', 'o.lang', 'el']
    ];

    protected const IS_TRANSLATABLE = true;

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['title', 'o.title', 'search'],
        ['contentType', 'o.contentType', 'in'],
        ['lang', 'el.id', 'in'],
        ['languageGroup', 'o.languageGroup', 'equals']
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

    public function findNumberOfContentForAdmin(int $contentTypeId)
    {
        return $this->createQueryBuilder('c')
            ->select('COUNT(c)')
            ->leftJoin('c.contentType', 'ct')
            ->where('ct.id = :id')
            ->setParameter('id', $contentTypeId)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    public function findContentByPageIdForAdmin(int $pageId)
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.page', 'p')
            ->leftJoin('c.contentType', 'ct')
            ->where('ct.pageType = 1')
            ->andWhere('p.id = :pageId')
            ->setParameter("pageId", $pageId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
