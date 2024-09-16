<?php

namespace App\Repository;

use App\Entity\Order\EventRow;
use Doctrine\Persistence\ManagerRegistry;

class EventRowRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventRow::class);
    }

    public function findOneById(int $id): ?EventRow
    {
        return $this->createQueryBuilder("cr")
            ->where("cr.id = :id")
            ->setParameter("id", $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneByIdForWebsite(int $id): ?EventRow
    {
        return $this->createQueryBuilder("cr")
            ->addSelect("c")
            ->leftJoin("cr.cart", "c")
            ->where("c.active = 1")
            ->andWhere("cr.id = :id")
            ->setParameter("id", $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneEventRowByCartForWebsite(int $cartId, int $eventDateId): ?EventRow
    {
        return $this->createQueryBuilder("cr")
            ->addSelect("c")
            ->addSelect("ed")
            ->innerJoin("cr.cart", "c", "WITH", "c.id = :cartId")
            ->leftJoin("cr.eventDate", "ed")
            ->where("ed.id = :eventDateId")
            ->setParameter("cartId", $cartId)
            ->setParameter("eventDateId", $eventDateId)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
