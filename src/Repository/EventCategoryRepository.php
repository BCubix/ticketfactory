<?php

namespace App\Repository;

use App\Entity\EventCategory;

use Doctrine\Persistence\ManagerRegistry;

class EventCategoryRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventCategory::class);
    }

    public function findAllForAdmin(array $filters = [], int $categoryId = null)
    {
        list($limit, $page, $sortField, $sortOrder) = $this->getSortParameters($filters);

        $results = $this->createQueryBuilder('o');

        if ($categoryId != null) {
            $results
                ->innerJoin('o.parent', 'p')
                ->where('p.id = :categoryId')
                ->setParameter('categoryId', $categoryId)
            ;
        }

        foreach (static::FILTERS as $filterArray) {
            if (!isset($filters[$filterArray[0]]) || is_null($filters[$filterArray[0]])) {
                continue;
            }

            list($filterField, $filterOperator, $filterConst, $filterValue) = $this->getFilterParameters($filterArray, $filters[$filterArray[0]]);

            $results
                ->andWhere($filterField . ' ' . $filterOperator . ' ' . $filterConst)
			    ->setParameter($filterConst, $filterValue)
		    ;
        }

        return $results
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->orderBy($sortField, $sortOrder)
            ->getQuery()
            ->getResult()
        ;
    }
}
