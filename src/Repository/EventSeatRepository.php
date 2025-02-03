<?php

namespace App\Repository;

use App\Entity\Order\EventSeat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class EventSeatRepository extends ServiceEntityRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventSeat::class);
    }

    public function findGroupedEventSeatsForWebsite(int $eventRowId): ?array
    {
        return $this->createQueryBuilder('cs')
            ->addSelect("cr")
            ->addSelect("c")
            ->addSelect("ep")
            ->innerJoin("cs.eventRow", "cr", "WITH", "cr.id = :eventRowId")
            ->innerJoin("cr.cart", "c", "WITH", "c.active = 1")
            ->leftJoin("cs.eventPrice", "ep")
            ->setParameter("eventRowId", $eventRowId)
            ->orderBy("ep.price", "ASC")
            ->getQuery()
            ->getResult();
    }

    public function findAllByEventPriceForWebsite(int $eventRowId, int $eventPriceId): ?array
    {
        return $this->createQueryBuilder('cs')
            ->addSelect("cr")
            ->addSelect("ep")
            ->leftJoin("cs.eventRow", "cr")
            ->leftJoin("cs.eventPrice", "ep")
            ->where("cr.id = :eventRowId")
            ->andWhere("ep.id = :eventPriceId")
            ->setParameter("eventRowId", $eventRowId)
            ->setParameter("eventPriceId", $eventPriceId)
            ->orderBy("cs.id", "DESC")
            ->getQuery()
            ->getResult();
    }
}
