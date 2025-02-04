<?php

namespace App\Repository;

use App\Entity\Order\Order;
use Doctrine\Persistence\ManagerRegistry;

class OrderRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const SELECTS = [
        'os' => null,
        'ocu' => null,
        'oca' => null,
    ];

    protected const JOINS = [
        ['leftJoin', 'o.status', 'os'],
        ['leftJoin', 'o.customer', 'ocu'],
        ['leftJoin', 'o.cart', 'oca'],
    ];

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['reference', 'o.reference', 'search'],
        ['status', 'os.id', 'in'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'status' => 'os.name',
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }

    public function findOneForWebsite(int $orderId, int $customerId): ?Order
    {
        return $this->createQueryBuilder('o')
            ->innerJoin('o.customer', 'c', 'WITH', 'c.id = :customerId')
            ->where("o.active = 1")
            ->andWhere("o.id = :orderId")
            ->setParameter("customerId", $customerId)
            ->setParameter("orderId", $orderId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findValidatedOrders(): array
    {
        return $this->createQueryBuilder('o')
            ->innerJoin('o.status', 'os')
            ->where('os.keyword = :keyword')
            ->setParameter('keyword', 'validated')
            ->getQuery()
            ->getResult();
    }
    
    public function findLatestOrders(int $limit = 5): array
    {
        return $this->createQueryBuilder('o')
        ->leftJoin('o.status', 'os')
        ->leftJoin('o.customer', 'ocu')
        ->leftJoin('o.cart', 'oca')
        ->addSelect('os', 'ocu', 'oca')
        ->where('os.keyword = :keyword')
        ->setParameter('keyword', 'validated')
        ->orderBy('o.updatedAt', 'DESC')
        ->setMaxResults($limit)
        ->getQuery()
        ->getResult();
    }
    
    public function findBetweenDates(\DateTime $beginDate, \DateTime $endDate): array
    {
        return $this->createQueryBuilder('o')
            ->where('o.createdAt >= :beginDate')
            ->andWhere('o.createdAt <= :endDate')
            ->setParameter('beginDate', $beginDate)
            ->setParameter('endDate', $endDate)
            ->getQuery()
            ->getResult();
    }
}
