<?php

namespace App\Repository;

use Doctrine\Persistence\ManagerRegistry;

abstract class CrudRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry, string $className)
    {
        parent::__construct($registry, $className);
    }

    public function findAllForAdmin(array $filters = [])
    {
        list($limit, $page, $sortField, $sortOrder) = $this->getSortParameters($filters);

        $results = $this->createQueryBuilder('o');

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

    public function findOneForAdmin(int $id)
    {
        return $this->createQueryBuilder('o')
            ->where('o.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
