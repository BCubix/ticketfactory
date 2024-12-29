<?php

namespace App\Repository;

use App\Entity\Event\EventPriceCategory;

use Doctrine\Persistence\ManagerRegistry;

class EventPriceCategoryRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventPriceCategory::class);
    }

    public function findEventPriceCategoriesForWebsite(int $eventId)
    {
        return $this->createQueryBuilder('epb')
            ->addSelect('ep')
            ->innerJoin('epb.event', 'e')
            ->innerJoin('epb.eventPrices', 'ep')
            ->where('e.id = :eventId')
            ->setParameter('eventId', $eventId)
            ->orderBy('epb.id', 'ASC')
            ->addOrderBy('ep.price', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
