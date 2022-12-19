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

    public function findAllHooksForAdmin()
    {
        return $this->createQueryBuilder('u')
            ->orderBy('u.name', 'ASC')
            ->addOrderBy('u.position', 'ASC')
            ->getQuery()
            ->getResult()
        ;
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

    public function findAllByNameForAdmin(string $name)
    {
        return $this->createQueryBuilder('u')
            ->where('u.name = :name')
            ->setParameter('name', $name)
            ->orderBy('u.position', 'ASC')
            ->getQuery()
            ->getResult()
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
}