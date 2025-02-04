<?php

namespace App\Repository;

use App\Entity\Product\ProductStockMovement;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProductStockMovement>
 *
 * @method ProductStockMovement|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProductStockMovement|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProductStockMovement[]    findAll()
 * @method ProductStockMovement[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductStockMovementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProductStockMovement::class);
    }

    public function findAllForProduct(int $productId): array
    {
        return $this->createQueryBuilder('psm')
            ->andWhere('psm.product = :productId')
            ->setParameter('productId', $productId)
            ->orderBy('psm.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return ProductStockMovement[] Returns an array of ProductStockMovement objects
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

    //    public function findOneBySomeField($value): ?ProductStockMovement
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
