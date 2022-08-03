<?php

namespace App\Repository;

use App\Entity\User;

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

        return $this->createQueryBuilder('o')
            ->where('u.email LIKE :email')
            ->andWhere('u.active = 1')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult()
        ;
   }
}
