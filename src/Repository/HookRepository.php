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

    public function findOneByNameAndModuleNameForAdmin(string $hookName, string $moduleName)
    {
        return $this->createQueryBuilder('u')
            ->innerJoin('u.module', 'm')
            ->where('m.name = :moduleName')
            ->andWhere('u.name = :hookName')
            ->setParameter('hookName', $hookName)
            ->setParameter('moduleName', $moduleName)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findAllByModuleNameForAdmin(string $moduleName)
    {
        return $this->createQueryBuilder('u')
            ->innerJoin('u.module', 'm')
            ->where('m.name = :moduleName')
            ->setParameter('moduleName', $moduleName)
            ->getQuery()
            ->getResult()
        ;
    }
}