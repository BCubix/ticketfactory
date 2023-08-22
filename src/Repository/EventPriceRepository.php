<?php

namespace App\Repository;

use App\Entity\Event\EventPrice;
use Doctrine\Persistence\ManagerRegistry;

class EventPriceRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventPrice::class);
    }

    public function findOneByIdForWebsite(int $id, ?int $eventId = null) {
        $result = $this->createQueryBuilder("ep")
            ->addSelect("epb")
            ->addSelect("e")
            ->innerJoin("ed.eventPriceBlock", "edb")
            ->innerJoin("epb.event", "e", 'WITH', "e.active = 1")
            ->where("ep.id = :eventPriceId")
            ->setParameter("eventPriceId", $id)
        ;
            
        if (null !== $eventId) {
            $result = $result
                ->andWhere("e.id = :eventId")
                ->setParameter("eventId", $eventId)
            ;
        }

        return $result
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}