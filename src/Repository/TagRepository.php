<?php

namespace App\Repository;

use App\Entity\Event\Tag;

use Doctrine\Persistence\ManagerRegistry;

class TagRepository extends CrudRepository
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
        parent::__construct($registry, Tag::class);
    }

    public function findBySlugForWebsite(int $languageId, string $slug): ?Tag
    {
        return $this->createQueryBuilder('s')
            ->innerJoin('s.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('s.active = 1')
            ->andWhere('s.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllForWebsite(int $languageId): array
    {
        return $this->createQueryBuilder('t')
            ->innerJoin('t.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where("t.active = 1")
            ->orderBy('t.id', 'ASC')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getResult();
    }
}
