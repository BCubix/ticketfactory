<?php

namespace App\Repository;

use App\Entity\Order\Order;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class OrderRepository extends CrudRepository
{
    protected const SELECTS = [
        'os' => null,
        'ocu' => null,
        'oca' => null,
    ];

    protected const JOINS = [
        ['leftJoin', 'o.status', 'os'],
        ['leftJoin', 'o.customer', 'ocu'],
        ['leftJoin', 'o.cart', 'oca'],
    ];

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['reference', 'o.reference', 'search'],
        ['status', 'os.id', 'in'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'status' => 'os.name',
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }
}
