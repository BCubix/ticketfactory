<?php

namespace App\Repository;

use App\Entity\User\User;

use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;

class UserRepository extends CrudRepository implements UserLoaderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function loadUserByIdentifier(string $email): ?User
    {
        $email = strtolower($email);

        return $this->createQueryBuilder('u')
            ->where('u.email LIKE :email')
            ->andWhere('u.active = 1')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function loadUserByUsername(string $email): ?User
    {
        return $this->loadUserByIdentifier($email);
    }

    public function findAdminUsersForAdmin(): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.roles LIKE :adminRole')
            ->setParameter('adminRole', 'ROLE_ADMIN')
            ->getQuery()
            ->getResult()
        ;
    }
}
