<?php

namespace App\Repository;

use App\Entity\Parameter\Parameter;

use Doctrine\Persistence\ManagerRegistry;

class ParameterRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Parameter::class);
    }

    public function findOneByKeyForAdmin(string $key)
    {
        return $this->createQueryBuilder('o')
            ->where('o.paramKey = :key')
            ->setParameter('key', $key)
            ->getQuery()
            ->getOneOrNullResult()
            ;
    }
}
