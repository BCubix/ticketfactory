<?php

namespace App\Repository;

use App\Entity\Parameter;

use Doctrine\Persistence\ManagerRegistry;

class ParameterRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Parameter::class);
    }
}