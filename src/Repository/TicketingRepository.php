<?php

namespace App\Repository;

use App\Entity\Ticketing\Ticketing;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TicketingRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ticketing::class);
    }

    public function findDefaultForAdmin(): ?Ticketing
    {
        return $this->createQueryBuilder('t')
            ->where('t.defaultTicketing = 1')
            ->getQuery()
            ->getOneOrNullResult();
    }
}
