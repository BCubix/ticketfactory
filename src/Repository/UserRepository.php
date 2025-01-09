<?php

namespace App\Repository;

use App\Entity\User\User;

use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;

class UserRepository extends CrudRepository implements UserLoaderInterface
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['email', 'o.email', 'search'],
        ['firstName', 'o.firstName', 'search'],
        ['lastName', 'o.lastName', 'search'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'email' => 'o.email',
        'firstName' => 'o.firstName',
        'lastName' => 'o.lastName',
    ];

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
            ->getOneOrNullResult();
    }

    public function loadUserByUsername(string $email): ?User
    {
        return $this->loadUserByIdentifier($email);
    }

    public function findAllByRoleForAdmin(string $role): array
    {
        return $this->createQueryBuilder('u')
            ->addSelect('p')
            ->addSelect('r')
            ->innerJoin('u.profiles', 'p')
            ->innerJoin('p.roles', 'r')
            ->where('r.name LIKE :role')
            ->setParameter('role', $role)
            ->getQuery()
            ->getResult();
    }

    public function getUserByTokenForWebsite($userEmail, $userPass): ?User
    {
        return $this->createQueryBuilder('u')
            ->where('u.email = :userEmail')
            ->setParameter('userEmail', $userEmail)
            ->andWhere('u.password LIKE :userPass')
            ->setParameter('userPass', '%' . $userPass)
            ->andWhere('u.active = 1')
            ->getQuery()
            ->getOneOrNullResult();
    }
}
