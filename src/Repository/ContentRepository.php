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

    public function findOneBySlugForWebsite(string $slug)
    {
        return $this->createQueryBuilder('c')
            ->where("c.active = 1")
            ->andWhere('c.publicationStatus = :publicationStatus')
            ->andWhere('c.slug = :slug')
            ->setParameter("slug", $slug)
            ->setParameter('publicationStatus', Content::STATUS_PUBLISHED)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllByTypeKeywordForWebsite(int $languageId, string $keyword)
    {
        return $this->createQueryBuilder('c')
            ->innerJoin('c.lang', 'l', 'WITH', 'l.id = :languageId')
            ->innerJoin('c.contentType', 't')
            ->where("c.active = 1")
            ->andWhere('c.publicationStatus = :publicationStatus')
            ->andWhere('t.keyword = :keyword')
            ->setParameter("languageId", $languageId)
            ->setParameter('publicationStatus', Content::STATUS_PUBLISHED)
            ->setParameter("keyword", $keyword)
            ->getQuery()
            ->getResult();
    }

    public function findAllByTypeIdForWebsite(int $languageId, string $id)
    {
        return $this->createQueryBuilder('c')
            ->innerJoin('c.lang', 'l', 'WITH', 'l.id = :languageId')
            ->innerJoin('c.contentType', 't')
            ->where("c.active = 1")
            ->andWhere('c.publicationStatus = :publicationStatus')
            ->andWhere('t.id = :id')
            ->setParameter("languageId", $languageId)
            ->setParameter('publicationStatus', Content::STATUS_PUBLISHED)
            ->setParameter("id", $id)
            ->getQuery()
            ->getResult();
    }

    public function findBySlugForWebsite(int $languageId, string $slug, bool $activeFilter = true): ?Content
    {
        $result = $this->createQueryBuilder('c')
            ->innerJoin('c.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('c.slug = :slug');

        if ($activeFilter) {
            $result = $result->andWhere('c.active = 1')
            ->andWhere('c.publicationStatus = :publicationStatus')
            ->setParameter('publicationStatus', Content::STATUS_PUBLISHED);
        }

        return $result
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
