<?php

namespace App\Repository;

use App\Entity\Order\Cart;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;


class CartRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cart::class);
    }

    public function findOneByIdForWebsite(int $id): ?Cart {
        return $this->createQueryBuilder("c")
            ->where("c.active = 1")
            ->andWhere("c.id = :id")
            ->setParameter("id", $id)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
