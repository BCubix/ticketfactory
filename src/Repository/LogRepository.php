<?php

namespace App\Repository;

use App\Entity\Technical\Log;

use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

class LogRepository extends AbstractRepository
{
    protected const FILTERS = [
        ['id', 'l.id', 'equals'],
        ['severity', 'l.severity', 'equals'],
        ['errorCode', 'l.errorCode', 'equals'],
        ['message', 'l.message', 'search'],
        ['objectName', 'l.objectName', 'search'],
        ['objectId', 'l.objectId', 'equals'],
        ['user', 'u.lastName', 'search']
    ];

    protected const SORTS = [
        'id' => 'l.id',
        'severity' => 'l.severity',
        'errorCode' => 'l.errorCode',
        'message' => 'l.message',
        'objectName' => 'l.objectName',
        'objectId' => 'l.objectId',
        'user' => 'u.lastName, u.firstName'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Log::class);
    }

    public function findAllForAdmin(array $filters = [])
    {
        list($limit, $page, $sortField, $sortOrder) = $this->getSortParameters($filters);

        $results = $this->createQueryBuilder('l');

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
}
