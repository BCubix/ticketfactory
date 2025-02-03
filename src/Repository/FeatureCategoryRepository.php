<?php

namespace App\Repository;

use App\Entity\Feature\FeatureCategory;

use Doctrine\Persistence\ManagerRegistry;

class FeatureCategoryRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const SELECTS = [
        'el' => null
    ];

    protected const JOINS = [
        ['leftJoin', 'o.lang', 'el']
    ];

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
        ['keyword', 'o.keyword', 'search'],
        ['lang', 'el.id', 'in'],
        ['languageGroup', 'o.languageGroup', 'equals']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name',
        'keyword' => 'o.keyword',
    ];

    protected const IS_TRANSLATABLE = true;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeatureCategory::class);
    }

    public function findOneByKeywordForAdmin(int $languageId, string $keyword)
    {
        return $this->createQueryBuilder('fc')
            ->innerJoin('fc.lang', 'l', 'WITH', 'l.id = :languageId')
            ->leftJoin('fc.features', 'f')
            ->andWhere('fc.keyword = :keyword')
            ->setParameter('languageId', $languageId)
            ->setParameter('keyword', $keyword)
            ->orderBy('f.position', 'DESC')
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneByKeywordForWebsite(string $keyword)
    {
        return $this->createQueryBuilder('fc')
            ->leftJoin('fc.features', 'f', 'WITH', 'f.active = 1')
            ->where('fc.active = 1')
            ->andWhere('fc.keyword = :keyword')
            ->setParameter('keyword', $keyword)
            ->orderBy('f.position', 'DESC')
            ->getQuery()
            ->getOneOrNullResult();
    }
}
