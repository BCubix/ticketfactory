<?php

namespace App\Repository;

use App\Entity\Technical\Redirection;

use Doctrine\Persistence\ManagerRegistry;

class RedirectionRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Redirection::class);
    }
}
