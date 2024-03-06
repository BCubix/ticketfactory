<?php

namespace App\Repository;

class MediaCategoryRepository extends AbstractNestedTreeRepository
{
    /*** > Trait ***/
    /*** < Trait ***/


    public function findByLvlForWebsite(int $languageId, int $lvl, string $slug = null)
    {
        $results = $this
            ->createQueryBuilder('mc')
            ->innerJoin('mc.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('mc.active = 1')
            ->andWhere('mc.lvl = :lvl')
            ->orderBy('mc.root, mc.position', 'ASC')
            ->setParameter('languageId', $languageId)
            ->setParameter('lvl', $lvl);

        if (null !== $slug) {
            $results
                ->andWhere('mc.slug = :slug')
                ->setParameter('slug', $slug);
        }

        $results = $results
            ->getQuery()
            ->getResult();

        if (count($results) == 0) {
            return null;
        }

        return $results[0];
    }
}
