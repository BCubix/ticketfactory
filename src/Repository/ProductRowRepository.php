<?php

namespace App\Repository;

use App\Entity\Order\ProductRow;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProductRowRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProductRow::class);
    }

    public function findOneProductRowByCartForWebsite(int $cartId, int $productId): ?ProductRow
    {
        return $this->createQueryBuilder("pr")
            ->addSelect("c")
            ->addSelect("p")
            ->innerJoin("pr.cart", "c", "WITH", "c.id = :cartId")
            ->leftJoin("pr.product", "p")
            ->where("p.id = :productId")
            ->setParameter("cartId", $cartId)
            ->setParameter("productId", $productId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneByIdForWebsite(int $id): ?ProductRow
    {
        return $this->createQueryBuilder("pr")
            ->addSelect("c")
            ->leftJoin("pr.cart", "c")
            ->where("c.active = 1")
            ->andWhere("pr.id = :id")
            ->setParameter("id", $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
