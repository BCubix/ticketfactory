<?php

namespace App\Repository;

use App\Entity\Event\EventDateBlock;
use Doctrine\Persistence\ManagerRegistry;

class EventDateBlockRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventDateBlock::class);
    }

    public function findEventDateBlocksForWebsite(int $eventId)
    {
        return $this->createQueryBuilder('edb')
            ->addSelect('ed')
            ->innerJoin('edb.event', 'e')
            ->innerJoin('edb.eventDates', 'ed')
            ->where('e.id = :eventId')
            ->setParameter('eventId', $eventId)
            ->orderBy('edb.id', 'ASC')
            ->addOrderBy('ed.eventDate', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
}