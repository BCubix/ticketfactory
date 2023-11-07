<?php

namespace App\Repository;

use App\Entity\Order\CartSeat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class CartSeatRepository extends ServiceEntityRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CartSeat::class);
    }

    public function findGroupedCartSeatsForWebsite(int $cartRowId): ?array
    {
        return $this->createQueryBuilder('cs')
            ->addSelect("cr")
            ->addSelect("c")
            ->addSelect("ep")
            ->innerJoin("cs.cartRow", "cr", "WITH", "cr.id = :cartRowId")
            ->innerJoin("cr.cart", "c", "WITH", "c.active = 1")
            ->leftJoin("cs.eventPrice", "ep")
            ->setParameter("cartRowId", $cartRowId)
            ->orderBy("ep.price", "ASC")
            ->getQuery()
            ->getResult();
    }

    public function findAllByEventPriceForWebsite(int $cartRowId, int $eventPriceId): ?array
    {
        return $this->createQueryBuilder('cs')
            ->addSelect("cr")
            ->addSelect("ep")
            ->leftJoin("cs.cartRow", "cr")
            ->leftJoin("cs.eventPrice", "ep")
            ->where("cr.id = :cartRowId")
            ->andWhere("ep.id = :eventPriceId")
            ->setParameter("cartRowId", $cartRowId)
            ->setParameter("eventPriceId", $eventPriceId)
            ->orderBy("cs.id", "DESC")
            ->getQuery()
            ->getResult();
    }
}
