<?php

namespace App\Repository;

use App\Entity\Lng;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Lng>
 *
 * @method Lng|null find($id, $lockMode = null, $lockVersion = null)
 * @method Lng|null findOneBy(array $criteria, array $orderBy = null)
 * @method Lng[]    findAll()
 * @method Lng[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LngRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Lng::class);
    }

//    /**
//     * @return Lng[] Returns an array of Lng objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('l.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Lng
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
