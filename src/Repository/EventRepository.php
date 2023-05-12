<?php

namespace App\Repository;

use App\Entity\Event\Event;
use App\Service\Sort\EventSorter;

use Doctrine\Persistence\ManagerRegistry;

class EventRepository extends CrudRepository
{
    protected const SELECTS = [
        'ec' => null,
        'es' => null,
        'er' => null,
        'et' => null,
        'el' => null,
        'ed' => null,
        'edb' => null,
    ];

    protected const JOINS = [
        ['leftJoin', 'o.eventCategories', 'ec'],
        ['leftJoin', 'o.season', 'es'],
        ['leftJoin', 'o.room', 'er'],
        ['leftJoin', 'o.tags', 'et'],
        ['leftJoin', 'o.lang', 'el'],
        ['leftJoin', 'o.eventDateBlocks', 'edb'],
        ['leftJoin', 'edb.eventDates', 'ed'],
    ];

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
        ['category', 'ec.id', 'in'],
        ['season', 'es.id', 'in'],
        ['room', 'er.id', 'in'],
        ['tags', 'et.id', 'in'],
        ['lang', 'el.id', 'in'],
        ['languageGroup', 'o.languageGroup', 'equals']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name',
        'category' => 'ec.name',
        'season' => 'es.name',
        'room' => 'er.name',
        'tags' => 'et.name',
    ];

    protected const IS_TRANSLATABLE = true;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }

    public function findAllForWebsite(int $languageId, array $filters): ?array
    {
        $events = $this->createQueryBuilder('e')
            ->addSelect('s')
            ->addSelect('c')
            ->addSelect('em')
            ->addSelect('m')
            ->innerJoin('e.lang', 'l', 'WITH', 'l.id = :languageId')
            ->innerJoin('e.season', 's')
            ->innerJoin('e.eventCategories', 'c')
            ->leftJoin('e.eventMedias', 'em')
            ->leftJoin('em.media', 'm')
    	    ->where('e.active = 1')
        ;

        if (!empty($filters['season'])) {
            $events
                ->andWhere('s.id = :seasonId')
                ->setParameter('seasonId', $filters['season'])
            ;
        }

        if (!empty($filters['category'])) {
            $events
                ->andWhere('c.id = :categoryId')
                ->setParameter('categoryId', $filters['category'])
            ;
        }

        return $events
            ->setParameter('languageId', $languageId)
    	    ->getQuery()
    	    ->getResult()
    	;
    }

    public function findOneForWebsite(int $languageId, int $pageId): ?Event
    {
        return $this->createQueryBuilder('e')
            ->innerJoin('e.lang', 'l', 'WITH', 'l.id = :languageId')
            ->andWhere('e.id = :pageId')
            ->setParameter('languageId', $languageId)
            ->setParameter('pageId', $pageId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findBySlugForWebsite(int $languageId, string $slug): ?Event
    {
        return $this->createQueryBuilder('e')
            ->innerJoin('e.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('e.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
