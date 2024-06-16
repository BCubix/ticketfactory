<?php

namespace App\Repository;

use App\Entity\Content\Content;

use Doctrine\Persistence\ManagerRegistry;

class ContentRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const SELECTS = [
        'el' => null,
    ];

    protected const JOINS = [
        ['leftJoin', 'o.lang', 'el'],
        ['leftJoin', 'o.contentType', 'ct']
    ];

    protected const IS_TRANSLATABLE = true;

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['title', 'o.title', 'search'],
        ['contentType', 'ct.id', 'in'],
        ['lang', 'el.id', 'in'],
        ['languageGroup', 'o.languageGroup', 'equals']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'title' => 'o.title',
        'contentType' => 'ct.name'
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
            ->getSingleScalarResult();
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
            ->getOneOrNullResult();
    }

    public function findOneBySlugForWebsite(string $slug)
    {
        return $this->createQueryBuilder('c')
            ->where("c.active = 1")
            ->andWhere('c.slug = :slug')
            ->setParameter("slug", $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllByTypeKeyword(string $keyword)
    {
        return $this->createQueryBuilder('c')
            ->innerJoin('c.contentType', 't')
            ->where("c.active = 1")
            ->andWhere('t.keyword = :keyword')
            ->setParameter("keyword", $keyword)
            ->getQuery()
            ->getResult();
    }

    public function findAllByTypeIdForWebsite(string $id)
    {
        return $this->createQueryBuilder('c')
            ->innerJoin('c.contentType', 't')
            ->where("c.active = 1")
            ->andWhere('t.id = :id')
            ->setParameter("id", $id)
            ->getQuery()
            ->getResult();
    }

    public function findBySlugForWebsite(int $languageId, string $slug, bool $activeFilter = true): ?Content
    {
        $result = $this->createQueryBuilder('c')
            ->innerJoin('c.lang', 'l', 'WITH', 'l.id = :languageId');

        if ($activeFilter) {
            $result = $result->where('c.active = 1');
        }

        return $result->andWhere('c.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
