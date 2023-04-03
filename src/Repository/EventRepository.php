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
}
