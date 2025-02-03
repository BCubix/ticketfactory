<?php

namespace App\Repository;

use App\Entity\Order\Cart;
use Doctrine\Persistence\ManagerRegistry;


class CartRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cart::class);
    }

    public function findOneByIdForWebsite(int $id): ?Cart
    {
        return $this->createQueryBuilder("c")
            ->addSelect("cr")
            ->leftJoin("c.eventRows", "cr")
            ->where("c.active = 1")
            ->andWhere("c.id = :id")
            ->setParameter("id", $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getLatestCart(int $customerId): ?Cart
    {
        return $this->createQueryBuilder("c")
            ->addSelect("cu")
            ->addSelect("cr")
            ->innerJoin("c.customer", "cu", "WITH", "cu.id = :customerId")
            ->leftJoin("c.eventRows", "cr")
            ->where("c.active = 1")
            ->setParameter("customerId", $customerId)
            ->orderBy("c.updatedAt", "DESC")
            ->setMaxResults(1)
            ->getquery()
            ->getOneOrNullResult();
    }

    public function findInactiveRecentCarts(): array
    {
        $dateThreshold = new \DateTime();
        $dateThreshold->modify('-30 minutes');

        return $this->createQueryBuilder("c")
            ->where("c.active = 1")
            ->andWhere("c.updatedAt < :dateThreshold")
            ->setParameter("dateThreshold", $dateThreshold)
            ->getQuery()
            ->getResult();
    }

    public function getAllActiveCarts(): array
    {
        return $this->createQueryBuilder("c")
            ->where("c.active = 1")
            ->orderBy("c.updatedAt", "DESC")
            ->getQuery()
            ->getResult();
    }
}
