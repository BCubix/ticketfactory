<?php

namespace App\Repository;

use App\Entity\Hook\Hook;
use Doctrine\Persistence\ManagerRegistry;

class HookRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Hook::class);
    }

    public function findOneByNameForAdmin(string $name)
    {
        return $this->createQueryBuilder('u')
            ->where('u.name = :name')
            ->setParameter('name', $name)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}