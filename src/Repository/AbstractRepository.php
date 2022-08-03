<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

abstract class AbstractRepository extends ServiceEntityRepository
{
    protected const FILTERS = [];
    protected const SORTS = ['id' => 'o.id'];

    private const OPERATOR_MAPPING = [
        'equals' => ['='],
        'like'   => ['LIKE'],
        'search' => ['LIKE', '%', '%'],
        'sup'    => ['>'],
        'inf'    => ['<'],
        'supeq'  => ['>='],
        'infeq'  => ['<=']
    ];

    public function __construct(ManagerRegistry $registry, string $className)
    {
        parent::__construct($registry, $className);
    }

    protected function getFilterParameters(array $filterArray, $filterValue): array
    {
        $filterField = $filterArray[1];

        $filterOperator = '';
        $filterPrev = '';
        $filterNext = '';

        $operatorMapping = self::OPERATOR_MAPPING[$filterArray[2]];

        if (isset($operatorMapping)) {
            $filterOperator = $operatorMapping[0];
            $filterPrev = isset($operatorMapping[1]) ? $operatorMapping[1] : '';
            $filterNext = isset($operatorMapping[2]) ? $operatorMapping[2] : '';
        }

        $filterConst = ':filter' . ucfirst($filterArray[0]);
        $filterValue = ($filterPrev . $filterValue . $filterNext);

        return [$filterField, $filterOperator, $filterConst, $filterValue];

    }

    protected function getSortParameters(array $filters): array
    {
        $data['limit'] = ($filters['limit'] ?? 10);
        $data['page'] = ($filters['page'] ?? 1);

        $defaultSort = array_reverse(static::SORTS);
        $defaultSort = array_pop($defaultSort);

        $data['sortField'] = $defaultSort;
        if (isset($filters['sortField']) && isset(static::SORTS[$filters['sortField']])) {
            $data['sortField'] = static::SORTS[$filters['sortField']];
        }

        $data['sortOrder'] = 'ASC';
        if (isset($filters['sortOrder']) && in_array($filters['sortOrder'], ['ASC', 'DESC'])) {
            $data['sortOrder'] = $filters['sortOrder'];
        }

        return array_values($data);
    }
}
