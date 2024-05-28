<?php

namespace App\Repository;

class ProductCategoryRepository extends AbstractNestedTreeRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function findallByIdsForWebsite(int $languageId, $ids): array
    {
        return $this->createQueryBuilder('pc')
            ->innerJoin('pc.lang', 'pcl', 'WITH', 'pcl.id = :languageId')
            ->where('pc.active = 1')
            ->andWhere('pc.id IN (:ids)')
            ->orderBy('pc.id', 'ASC')
            ->setParameter('languageId', $languageId)
            ->setParameter('ids', $ids)
            ->getQuery()
            ->getResult();
    }
}
