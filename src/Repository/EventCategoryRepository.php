<?php

namespace App\Repository;

use App\Entity\Event\EventCategory;

class EventCategoryRepository extends AbstractNestedTreeRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function findByKeywordForWebsite(int $languageId, string $keyword): ?EventCategory
    {
        return $this->createQueryBuilder('ec')
            ->innerJoin('ec.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('ec.keyword = :keyword')
            ->setParameter('languageId', $languageId)
            ->setParameter('keyword', $keyword)
            ->orderBy('ec.lvl', 'ASC')
            ->addOrderBy('ec.position', 'ASC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
