<?php

namespace App\Repository;

use App\Entity\Event\EventPrice;
use Doctrine\Persistence\ManagerRegistry;

class EventPriceRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventPrice::class);
    }

    public function findOneByIdForWebsite(int $id)
    {
        return $this->createQueryBuilder("ep")
            ->addSelect("epc")
            ->addSelect("e")
            ->innerJoin("ep.eventPriceCategory", "epc")
            ->innerJoin("epc.event", "e", 'WITH', "e.active = 1")
            ->where("ep.id = :eventPriceId")
            ->setParameter("eventPriceId", $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllByEventForWebsiteOption(int $eventId)
    {
        return $this->createQueryBuilder("ep")
            ->addSelect('epc')
            ->addSelect('e')
            ->innerjoin('ep.eventPriceCategory', 'epc')
            ->innerjoin('epc.event', 'e')
            ->where('e.id = :eventId')
            ->setParameter("eventId", $eventId)
            ->orderBy("ep.price", 'ASC');
    }

    public function findAllByEventForWebsite(int $eventId)
    {
        return $this->findAllByEventForWebsiteOption($eventId)
            ->getQuery()
            ->getResult();;
    }

    public function findSmallestPriceForWebsite(int $eventId)
    {
        return $this->createQueryBuilder("ep")
            ->addSelect('epc')
            ->addSelect('e')
            ->innerjoin('ep.eventPriceCategory', 'epc')
            ->innerjoin('epc.event', 'e')
            ->where('e.id = :eventId')
            ->setParameter("eventId", $eventId)
            ->orderBy("ep.price", 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
