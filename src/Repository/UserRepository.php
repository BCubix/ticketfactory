<?php

namespace App\Repository;

use App\Entity\User;

use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }
}
