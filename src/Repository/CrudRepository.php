<?php

namespace App\Repository;

use Doctrine\ORM\Tools\Pagination\Paginator;
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

        foreach (static::JOINS as $joinArray) {
            $joinType = $joinArray[0];

            if (isset($joinArray[3])) {
                $results->$joinType($joinArray[1], $joinArray[2], 'WITH', $joinArray[3]);
            } else {
                $results->$joinType($joinArray[1], $joinArray[2]);
            }
        }

        /*$results->select('o');
        foreach (static::SELECTS as $selectKey => $selectValue) {
            $selectComplete = ((null === $selectValue) ? $selectKey : ($selectValue . ' AS ' . $selectKey));
            $results->addSelect($selectComplete);
        }*/

        foreach (static::FILTERS as $filterArray) {
            if (!isset($filters[$filterArray[0]]) || is_null($filters[$filterArray[0]])) {
                continue;
            }

            list($filterField, $filterOperator, $filterConst, $filterValue) = $this->getFilterParameters($filterArray, $filters[$filterArray[0]]);

            $filterConstComplete = $filterConst;
            if ($filterOperator == 'IN') {
                $filterConstComplete = '(' . $filterConst . ')';
            }

            $results
                ->andWhere($filterField . ' ' . $filterOperator . ' ' . $filterConstComplete)
                ->setParameter($filterConst, $filterValue)
            ;
        }

        if ($page != 0) {
            $results = $results
                ->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit)
            ;
        }

        $results = $results
            ->orderBy($sortField, $sortOrder)
        ;

        $results = new Paginator($results);

        return [
            'results' => $results->getIterator()->getArrayCopy(),
            'total' => count($results)
        ];
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
