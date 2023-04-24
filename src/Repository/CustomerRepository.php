<?php

namespace App\Repository;

use App\Entity\Customer\Customer;

use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;

class CustomerRepository extends CrudRepository implements UserLoaderInterface
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['email', 'o.email', 'search'],
        ['firstName', 'o.firstName', 'search'],
        ['lastName', 'o.lastName', 'search']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'email' => 'o.email',
        'firstName' => 'o.firstName',
        'lastName' => 'o.lastName'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Customer::class);
    }

    public function loadCustomerByIdentifier(string $email): ?Customer
    {
        $email = strtolower($email);

        return $this->createQueryBuilder('c')
            ->where('c.email LIKE :email')
            ->andWhere('c.active = 1')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function loadUserByUsername(string $email): ?Customer
    {
        return $this->loadUserByIdentifier($email);
    }

    public function getUserByTokenForWebsite($customerEmail, $customerPass): ?Customer
    {
        return $this->createQueryBuilder('c')
            ->where('c.email = :customerEmail')
            ->setParameter('customerEmail', $customerEmail)
            ->andWhere('u.password LIKE :customerPass')
            ->setParameter('customerPass', '%' . $customerPass)
            ->andWhere('u.active = 1')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
