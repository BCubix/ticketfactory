<?php

namespace App\Repository;

use App\Entity\Module\Module;
use Doctrine\Persistence\ManagerRegistry;

class ModuleRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Module::class);
    }

    public function findAllActive()
    {
        return $this->createQueryBuilder('u')
            ->where('u.active = 1')
            ->getQuery()
            ->getResult()
            ;
    }

    public function findOneByName(string $name)
    {
        return $this->createQueryBuilder('u')
            ->where('u.name = :name')
            ->setParameter('name', $name)
            ->getQuery()
            ->getOneOrNullResult()
            ;
    }
}