<?php

namespace App\Repository\User;

use App\Entity\User\Role;
use App\Repository\CrudRepository;
use Doctrine\Persistence\ManagerRegistry;

class RoleRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Role::class);
    }
}
