<?php

namespace App\Repository;

use App\Entity\Order\Cart;
use Doctrine\Persistence\ManagerRegistry;


class CartRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cart::class);
    }

    public function findOneByIdForWebsite(int $id): ?Cart
    {
        return $this->createQueryBuilder("c")
            ->addSelect("cr")
            ->leftJoin("c.cartRows", "cr")
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
            ->leftJoin("c.cartRows", "cr")
            ->where("c.active = 1")
            ->setParameter("customerId", $customerId)
            ->orderBy("c.updatedAt", "DESC")
            ->setMaxResults(1)
            ->getquery()
            ->getOneOrNullResult();
    }
}
