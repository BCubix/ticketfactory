<?php

namespace App\Repository;

use App\Entity\Order\Voucher;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class VoucherRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Voucher::class);
    }

    public function findVouchersByCustomerForWebsite(int $userId): array {
        return $this->createQueryBuilder('v')
            ->addSelect('c')
            ->leftJoin('v.carts', 'c')
            ->innerJoin('c.linkedOrder', 'o')
            ->innerJoin('c.customer', 'u', 'WITH', 'u.id = :userId')
            ->where('v.active = 1')
            ->andWhere('c.active = 1')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findAllByCartForWebsite(int $cartId): array {
        return $this->createQueryBuilder('v')
            ->addSelect('c')
            ->innerJoin('v.carts', 'c', 'WITH', 'c.id = :cartId')
            ->where('v.active = 1')
            ->andWhere('c.active = 1')
            ->setParameter('cartId', $cartId)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findOneByCodeForWebsite(string $code): ?Voucher
    {
        return $this->createQueryBuilder('v')
            ->where('v.code = :code')
            ->andWhere('v.active = 1')
            ->setParameter('code', $code)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}