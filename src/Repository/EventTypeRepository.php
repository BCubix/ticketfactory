<?php

namespace App\Repository;

use App\Entity\Event\EventType;
use Doctrine\Persistence\ManagerRegistry;

class EventTypeRepository extends CrudRepository
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
        parent::__construct($registry, EventType::class);
    }

    public function findBySlugForWebsite(int $languageId, string $slug, bool $activeFilter = true): ?EventType
    {
        $result = $this->createQueryBuilder('et')
            ->innerJoin('et.lang', 'l', 'WITH', 'l.id = :languageId');

        if ($activeFilter) {
            $result = $result->where('et.active = 1');
        }

        return $result->andWhere('et.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllForWebsite(int $languageId): array
    {
        return $this->createQueryBuilder('et')
            ->innerJoin('et.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where("et.active = 1")
            ->orderBy('et.id', 'ASC')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getResult();
    }
}
