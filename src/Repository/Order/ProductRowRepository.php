<?php

namespace App\Repository\Order;

use App\Entity\Order\ProductRow;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProductRow>
 *
 * @method ProductRow|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProductRow|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProductRow[]    findAll()
 * @method ProductRow[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRowRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProductRow::class);
    }

    //    /**
    //     * @return ProductRow[] Returns an array of ProductRow objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ProductRow
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
