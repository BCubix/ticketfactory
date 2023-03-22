<?php

namespace App\Repository;

use App\Entity\Language\Language;

use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

abstract class CrudRepository extends AbstractRepository
{
    public function __construct(ManagerRegistry $registry, string $className)
    {
        parent::__construct($registry, $className);
    }

    public function findAllForAdmin(array $filters): array
    {
        $defaultLanguage = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin();

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

        if (static::IS_TRANSLATABLE && !isset($filters['lang'])) {
            $results
                ->andWhere('el.id = :defaultLangId')
                ->setParameter("defaultLangId", $defaultLanguage->getId())
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

    public function findTranslatedElementsForAdmin(array $languageGroupList, $filters)
    {
        $results = $this->createQueryBuilder('o')->addSelect('el');

        foreach (static::JOINS as $joinArray) {
            $joinType = $joinArray[0];

            if (isset($joinArray[3])) {
                $results->$joinType($joinArray[1], $joinArray[2], 'WITH', $joinArray[3]);
            } else {
                $results->$joinType($joinArray[1], $joinArray[2]);
            }
        }

        list($limit, $page, $sortField, $sortOrder) = $this->getSortParameters($filters);

        return $results
            ->andWhere('o.languageGroup IN (:languageGroupList)')
            ->setParameter('languageGroupList', $languageGroupList)
            ->addOrderBy($sortField, $sortOrder)
            ->addOrderBy('o.languageGroup', "ASC")
            ->addOrderBy('el.isDefault', 'DESC')
            ->addOrderBy('el.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findOneByLanguageForAdmin(int $languageId, string $languageGroup)
    {
        $results = $this->createQueryBuilder('o')->addSelect('el');

        foreach (static::JOINS as $joinArray) {
            $joinType = $joinArray[0];

            if (isset($joinArray[3])) {
                $results->$joinType($joinArray[1], $joinArray[2], 'WITH', $joinArray[3]);
            } else {
                $results->$joinType($joinArray[1], $joinArray[2]);
            }
        }

        return $results
            ->where('o.languageGroup = :languageGroup')
            ->setParameter('languageGroup', $languageGroup)
            ->andWhere('el.id = :languageId')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
