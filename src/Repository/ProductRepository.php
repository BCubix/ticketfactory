<?php

namespace App\Repository;

use App\Entity\Product\Product;

use Doctrine\Persistence\ManagerRegistry;

class ProductRepository extends CrudRepository
{
    protected const SELECTS = [
        'el' => null,
        'pc' => null
    ];

    protected const JOINS = [
        ['leftJoin', 'o.productCategories', 'pc'],
        ['leftJoin', 'o.lang', 'el'],
    ];

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
        ['category', 'pc.id', 'in'],
        ['lang', 'el.id', 'in'],
        ['languageGroup', 'o.languageGroup', 'equals']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name',
        'category' => 'pc.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function findAllForWebsite(array $filters = []): ?array
    {
        $results = $this->createQueryBuilder('p')
            ->where("p.active = 1")
            ->orderBy("p.name", "ASC")
            ->getQuery()
            ->getResult();

        return $results;
    }
}
