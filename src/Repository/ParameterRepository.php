<?php

namespace App\Repository;

use App\Entity\Parameter\Parameter;

use Doctrine\Persistence\ManagerRegistry;

class ParameterRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
        ['type', 'o.type', 'search'],
        ['paramKey', 'o.paramKey', 'search'],
        ['paramValue', 'o.paramValue', 'search'],
        ['tabName', 'o.tabName', 'search'],
        ['blockName', 'o.blockName', 'search'],
        ['breakpointsValue', 'o.breakpointsValue', 'search'],
    ];

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
