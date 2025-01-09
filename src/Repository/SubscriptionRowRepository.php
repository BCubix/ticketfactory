<?php

namespace App\Repository;

use App\Entity\Order\SubscriptionRow;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class SubscriptionRowRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SubscriptionRow::class);
    }

    public function findOneSubscriptionRowByCartForWebsite(int $cartId, int $subscriptionId): ?SubscriptionRow
    {
        return $this->createQueryBuilder("sr")
            ->addSelect("c")
            ->addSelect("s")
            ->innerJoin("sr.cart", "c", "WITH", "c.id = :cartId")
            ->leftJoin("sr.subscription", "s")
            ->where("s.id = :subscriptionId")
            ->setParameter("cartId", $cartId)
            ->setParameter("subscriptionId", $subscriptionId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllSubscriptionRowsByCustomerForWebsite(int $customerId)
    {
        return $this->createQueryBuilder("sr")
            ->addSelect("ca")
            ->addSelect("cu")
            ->innerJoin("sr.cart", "ca")
            ->innerJoin("ca.linkedOrder", "lo")
            ->innerJoin("ca.customer", "cu", "WITH", "cu.id = :customerId")
            ->setParameter("customerId", $customerId)
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForWebsite(int $id): ?SubscriptionRow
    {
        return $this->createQueryBuilder("sr")
            ->addSelect("s")
            ->leftJoin("sr.cart", "s")
            ->where("s.active = 1")
            ->andWhere("sr.id = :id")
            ->setParameter("id", $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllAvailableSubscriptions(int $customerId): array
    {
        return $this->createQueryBuilder("sr")
            ->addSelect('s')
            ->innerJoin("sr.cart", "ca")
            ->innerJoin("sr.subscription", "s")
            ->innerJoin("ca.customer", "cu", "WITH", "cu.id = :customerId")
            ->innerJoin("ca.linkedOrder", "lo", "WITH", "DATE_ADD(lo.createdAt, s.duration, 'MONTH') >= CURRENT_DATE()")
            ->leftJoin("sr.subscriptionUsages", "su")
            ->groupBy("sr.id")
            ->having("COUNT(su) < s.eventNb")
            ->setParameter("customerId", $customerId)
            ->getQuery()
            ->getResult();
    }
}
