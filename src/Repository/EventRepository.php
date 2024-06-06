<?php

namespace App\Repository;

use App\Entity\Event\Event;

use Doctrine\Persistence\ManagerRegistry;

class EventRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** > Module: HomeEvent ***/
    use \TicketFactory\Module\HomeEvent\Repository\Override\EventRepository;
    /*** < Module: HomeEvent ***/
    /*** > Module: Search ***/
    use \TicketFactory\Module\Search\Repository\Override\EventRepository;
    /*** < Module: Search ***/
    /*** < Trait ***/

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
            ->addSelect('r')
            ->addSelect('c')
            ->addSelect('em')
            ->addSelect('m')
            ->innerJoin('e.lang', 'l', 'WITH', 'l.id = :languageId')
            ->innerJoin('e.eventCategories', 'c')
            ->leftJoin('e.eventType', 'ty')
            ->leftJoin('e.tags', 'ta')
            ->leftJoin('e.season', 's')
            ->leftJoin('e.room', 'r')
            ->leftJoin('e.eventDateBlocks', 'edb')
            ->leftJoin('edb.eventDates', 'ed')
            ->leftJoin('e.eventMedias', 'em')
            ->leftJoin('em.media', 'm')
            ->where('e.active = 1');

        if (!empty($filters['season'])) {
            $events
                ->andWhere('s.id = :seasonId')
                ->setParameter('seasonId', $filters['season']);
        }

        if (!empty($filters['eventCategory']) && count($filters['eventCategory']) > 0) {
            $events
                ->andWhere('c.id IN (:eventCategoryId)')
                ->setParameter('eventCategoryId', $filters['eventCategory']);
        }

        if (!empty($filters['room'])) {
            $events
                ->andWhere('r.id = :roomId')
                ->setParameter('roomId', $filters['room']);
        }

        if (!empty($filters['tag']) && count($filters['tag']) > 0) {
            $events
                ->andWhere('ta.id IN (:tagId)')
                ->setParameter('tagId', $filters['tag']);
        }

        if (!empty($filters['eventType'])) {
            $events
                ->andWhere('ty.id = :eventTypeId')
                ->setParameter('eventTypeId', $filters['eventType']);
        }

        if (!empty($filters['month'])) {
            try {
                $beginDate = new \DateTime('20' . $filters['month'] . '-01');
                $endDate = clone $beginDate;
                $endDate->add(new \DateInterval('P1M'));

                $events
                    ->andWhere('ed.eventDate > :beginDate')
                    ->andWhere('ed.eventDate < :endDate')
                    ->setParameter('beginDate', $beginDate)
                    ->setParameter('endDate', $endDate);
            } catch (\Exception $e) {
            }
        }

        if (!empty($filters['beginDate'])) {
            try {
                $events
                    ->andWhere('ed.eventDate > :beginDate')
                    ->setParameter('beginDate', $filters['beginDate']);
            } catch (\Exception $e) {
            }
        }

        if (!empty($filters['endDate'])) {
            try {
                $events
                    ->andWhere('ed.eventDate < :endDate')
                    ->setParameter('endDate', $filters['endDate']);
            } catch (\Exception $e) {
            }
        }

        return $events
            ->orderBy('r.seatsNb', 'DESC')
            ->addOrderBy('ed.eventDate', 'ASC')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getResult();
    }

    public function findOneForWebsite(int $languageId, int $pageId): ?Event
    {
        return $this->createQueryBuilder('e')
            ->innerJoin('e.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where("e.active = 1")
            ->andWhere('e.id = :pageId')
            ->setParameter('languageId', $languageId)
            ->setParameter('pageId', $pageId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByIdForWebsite(int $languageId, int $eventId, bool $activeFilter = true): ?Event
    {
        $result = $this->createQueryBuilder('e')
            ->innerJoin('e.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('e.id = :eventId');

        if ($activeFilter) {
            $result = $result->andWhere('e.active = 1');
        }

        return $result->setParameter('languageId', $languageId)
            ->setParameter('eventId', $eventId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findBySlugForWebsite(int $languageId, string $slug, bool $activeFilter = true): ?Event
    {
        $result = $this->createQueryBuilder('e')
            ->innerJoin('e.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('e.slug = :slug');

        if ($activeFilter) {
            $result = $result->andWhere('e.active = 1');
        }

        return $result->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneByCategoriesForWebsite(array $categories, int $eventId): ?Event
    {
        return $this->createQueryBuilder('e')
            ->addSelect("ec")
            ->innerJoin("e.eventCategories", "ec", 'WITH', 'ec.id IN (:eventCategories)')
            ->where("e.id = :eventId")
            ->andWhere("e.active = 1")
            ->setParameter("eventId", $eventId)
            ->setParameter("eventCategories", $categories)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllForSitemap(): array
    {
        return $this->createQueryBuilder('e')
            ->where('e.active = 1')
            ->andWhere('e.indexed = 1')
            ->orderBy('e.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findEventLenghtForAdmin(int $ticketingId)
    {
        return $this->createQueryBuilder('e')
            ->select('COUNT(e)')
            ->leftJoin('e.ticketing', 't')
            ->where('t.id = :id')
            ->setParameter('id', $ticketingId)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findEventByTicketingForAdmin(int $ticketingId)
    {
        return $this->createQueryBuilder('e')
            ->leftJoin('e.ticketing', 't')
            ->where('t.id = :ticketingId')
            ->setParameter('ticketingId', $ticketingId)
            ->getQuery()
            ->getResult()
        ;
    }
}
