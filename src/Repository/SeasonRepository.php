<?php

namespace App\Repository;

use App\Entity\Event\Season;

use Doctrine\Persistence\ManagerRegistry;

class SeasonRepository extends CrudRepository
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
        ['beginYear', 'o.beginYear', 'equals'],
        ['name', 'o.name', 'search'],
        ['lang', 'el.id', 'in'],
        ['languageGroup', 'o.languageGroup', 'equals']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Season::class);
    }

    public function findAllForWebsite(int $languageId)
    {
    	return $this->createQueryBuilder('s')
            ->innerJoin('s.lang', 'l', 'WITH', 'l.id = :languageId')
    		->where('s.active = 1')
    		->orderBy('s.id', 'ASC')
            ->setParameter('languageId', $languageId)
    		->getQuery()
    		->getResult()
    	;
    }

    public function findOneForWebsite(int $languageId, int $seasonId): ?Season
    {
        return $this->createQueryBuilder('s')
            ->innerJoin('s.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('s.active = 1')
            ->andWhere('s.id = :seasonId')
            ->setParameter('languageId', $languageId)
            ->setParameter('seasonId', $seasonId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findByBeginYearForWebsite(int $languageId, int $defaultYear)
    {
    	return $this
    		->createQueryBuilder('s')
            ->innerJoin('s.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('s.beginYear = :defaultYear')
            ->setParameter('languageId', $languageId)
            ->setParameter('defaultYear', $defaultYear)
            ->getQuery()
    		->getOneOrNullResult()
    	;
    }

    public function findBySlugForWebsite(int $languageId, string $slug): ?Season
    {
        return $this->createQueryBuilder('s')
            ->innerJoin('s.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('s.active = 1')
            ->andWhere('s.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
