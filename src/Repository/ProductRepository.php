<?php

namespace App\Repository;

use App\Entity\Product\Product;

use Doctrine\ORM\Tools\Pagination\Paginator;
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

    public const WEBSITE_SORTS = [
        1 => ['p.name', 'ASC'],
        2 => ['p.price', 'ASC'],
        3 => ['p.price', 'DESC']
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function findAllForWebsite(int $languageId, array $filters = []): ?array
    {
        list($limit, $page, $sortField, $sortOrder) = $this->getWebsiteSortParameters($filters);

        $results = $this->createQueryBuilder('p')
            ->innerJoin('p.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where("p.active = 1");

        if (!empty($filters['search'])) {
            $results
                ->andWhere('p.name LIKe :search')
                ->setParameter('search', ('%' . $filters['search'] . '%'));
        }

        if (!empty($filters['topCategory'])) {
            $results
                ->innerJoin('p.mainCategory', 'mc')
                ->andWhere('mc.id = :mainCategory')
                ->setParameter('mainCategory', $filters['topCategory']);
        }

        if (!empty($filters['productCategories'])) {
            $results
                ->leftJoin('p.productCategories', 'pc')
                ->andWhere('pc.id IN (:productCategories)')
                ->setParameter('productCategories', $filters['productCategories']);
        }

        if ($page != 0) {
            $results = $results
                ->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit);
        }

        $results = $results
            ->setParameter('languageId', $languageId)
            ->orderBy($sortField, $sortOrder);

        $results = new Paginator($results);

        return array_values([
            'results' => $results->getIterator()->getArrayCopy(),
            'pagination' => [
                'page'  => $page,
                'limit' => $limit,
                'maxPage' => ceil(count($results) / $limit),
                'total' => count($results)
            ]
        ]);
    }

    protected function getWebsiteSortParameters(array $filters): array
    {
        $data['limit'] = ($filters['limit'] ?? 10);
        $data['page'] = ($filters['page'] ?? 1);

        $defaultSort = array_reverse(static::WEBSITE_SORTS);
        $defaultSort = array_pop($defaultSort);

        $data['sortField'] = $defaultSort[0];
        $data['sortOrder'] = $defaultSort[1];

        if (isset($filters['sortField']) && isset(static::WEBSITE_SORTS[$filters['sortField']])) {
            $data['sortField'] = static::WEBSITE_SORTS[$filters['sortField']][0];
            $data['sortOrder'] = static::WEBSITE_SORTS[$filters['sortField']][1];
        }

        return array_values($data);
    }

    public function findProductLenghtForAdmin(int $ticketingId)
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p)')
            ->leftJoin('p.ticketing', 't')
            ->where('t.id = :id')
            ->setParameter('id', $ticketingId)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findProductByTicketingForAdmin(int $ticketingId)
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.ticketing', 't')
            ->where('t.id = :ticketingId')
            ->setParameter('ticketingId', $ticketingId)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findBySlugForWebsite(int $languageId, string $slug, bool $activeFilter = true): ?Product
    {
        $result = $this->createQueryBuilder('p')
            ->innerJoin('p.lang', 'l', 'WITH', 'l.id = :languageId');

        if ($activeFilter) {
            $result = $result->where('p.active = 1');
        }

        return $result->andWhere('p.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneByIdForWebsite(int $productId):?Product
    {
        return $this->createQueryBuilder('p')
            ->where('p.active = 1')
            ->andWhere('p.id = :productId')
            ->setParameter('productId', $productId)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
