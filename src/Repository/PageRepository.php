<?php

namespace App\Repository;

use App\Entity\Page\Page;

use Doctrine\Persistence\ManagerRegistry;

class PageRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

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
        ['lang', 'el.id', 'in'],
        ['languageGroup', 'o.languageGroup', 'equals']
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

    public function findOneForWebsite(int $languageId, int $pageId): ?Page
    {
        return $this->createQueryBuilder('p')
            ->addSelect('pc')
            ->innerJoin('p.lang', 'l', 'WITH', 'l.id = :languageId')
            ->leftJoin('p.contents', 'pc')
            ->andWhere('p.id = :pageId')
            ->setParameter('languageId', $languageId)
            ->setParameter('pageId', $pageId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByKeywordForWebsite(int $languageId, string $keyword): array
    {
        return $this->createQueryBuilder('p')
            ->addSelect('pc')
            ->innerJoin('p.lang', 'l', 'WITH', 'l.id = :languageId')
            ->leftJoin('p.contents', 'pc')
            ->where('p.keyword = :keyword')
            ->setParameter('languageId', $languageId)
            ->setParameter('keyword', $keyword)
            ->getQuery()
            ->getResult();
    }

    public function findBySlugForWebsite(int $languageId, string $slug): ?Page
    {
        return $this->createQueryBuilder('p')
            ->addSelect('pc')
            ->innerJoin('p.lang', 'l', 'WITH', 'l.id = :languageId')
            ->leftJoin('p.contents', 'pc')
            ->where('p.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllForSitemap(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.active = 1')
            ->andWhere('p.indexed = 1')
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
