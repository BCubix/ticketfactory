<?php

namespace App\Repository;

use App\Entity\Event\Room;

use Doctrine\Persistence\ManagerRegistry;

class RoomRepository extends CrudRepository
{
    protected const SELECTS = [
        'el' => null
    ];

    protected const JOINS = [
        ['innerJoin', 'o.lang', 'el']
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
        'name' => 'o.name',
        'seatsNb' => 'o.seatsNb',
        'area' => 'o.area'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Room::class);
    }

    public function findBySlugForWebsite(int $languageId, string $slug): ?Room
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
