<?php

namespace App\Repository;

use App\Entity\Event\Event;

use Doctrine\Persistence\ManagerRegistry;

class EventRepository extends CrudRepository
{
    protected const SELECTS = [
        'ec' => null,
        'es' => null,
        'es' => null,
        'et' => null
    ];

    protected const JOINS = [
        ['leftJoin', 'o.mainCategory', 'ec'],
        ['leftJoin', 'o.season', 'es'],
        ['leftJoin', 'o.room', 'er'],
        ['leftJoin', 'o.tags', 'et']
    ];

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
        ['category', 'ec.id', 'in'],
        ['season', 'es.id', 'in'],
        ['room', 'er.id', 'in'],
        ['tags', 'et.id', 'in'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name',
        'category' => 'ec.name',
        'season' => 'es.name',
        'room' => 'er.name',
        'tags' => 'et.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }
}
