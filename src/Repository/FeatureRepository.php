<?php

namespace App\Repository;

use App\Entity\Feature\Feature;

use Doctrine\Persistence\ManagerRegistry;

class FeatureRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const SELECTS = [
        'el' => null,
        'fv' => null,
    ];

    protected const JOINS = [
        ['leftJoin', 'o.lang', 'el'],
        ['leftJoin', 'o.featureValues', 'fv', 'fv.custom = 0']
    ];

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
        ['keyword', 'o.keyword', 'search'],
        ['type', 'o.type', 'search'],
        ['filter', 'o.filter', 'equals'],
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
        parent::__construct($registry, Feature::class);
    }

    public function findOneForAdmin(int $id)
    {
        return $this->createQueryBuilder('o')
            ->addSelect("fv")
            ->leftJoin('o.featureValues', 'fv', 'WITH', "fv.custom = 0")
            ->where('o.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
