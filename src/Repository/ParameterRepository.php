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
}
