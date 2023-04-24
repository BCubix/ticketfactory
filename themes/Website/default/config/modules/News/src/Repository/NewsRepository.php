<?php

namespace TicketFactory\Module\News\Repository;

use App\Repository\CrudRepository;
use TicketFactory\Module\News\Entity\News\News;

use Doctrine\Persistence\ManagerRegistry;

class NewsRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active',        'o.active',        'equals'],
        ['title',         'o.title',         'search'],
        ['homeDisplayed', 'o.homeDisplayed', 'equals'],
    ];

    protected const SORTS = [
        'id'            => 'o.id',
        'active'        => 'o.active',
        'title'         => 'o.title',
        'homeDisplayed' => 'o.homeDisplayed',
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, News::class);
    }
}
