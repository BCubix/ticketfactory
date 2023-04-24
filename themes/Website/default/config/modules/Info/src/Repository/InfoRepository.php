<?php

namespace TicketFactory\Module\Info\Repository;

use App\Repository\CrudRepository;
use TicketFactory\Module\Info\Entity\Info\Info;

use Doctrine\Persistence\ManagerRegistry;

class InfoRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['title',  'o.title',  'search'],
    ];

    protected const SORTS = [
        'id'        => 'o.id',
        'active'    => 'o.active',
        'title'     => 'o.title',
        'beginDate' => 'o.beginDate',
        'endDate'   => 'o.endDate',
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Info::class);
    }
}
