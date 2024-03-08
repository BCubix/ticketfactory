<?php

namespace App\Repository;

use App\Entity\Feature\FeatureLink;

use Doctrine\Persistence\ManagerRegistry;

class FeatureLinkRepository extends AbstractRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeatureLink::class);
    }

    public function findAllFeatureLinksByEventForWebsite(int $id, string $categoryKeyword = null, string $featureKeyword = null): array
    {
        $results = $this->createQueryBuilder('fl')
            ->addSelect('e')
            ->addSelect('f')
            ->addSelect('fc')
            ->innerJoin('fl.event', 'e', 'WITH', 'e.id = :eventId')
        ;

        if (null == $featureKeyword) {
            $results->innerJoin('fl.feature', 'f');
        } else {
            $results
                ->innerJoin('fl.feature', 'f', 'WITH', 'f.keyword = :featureKeyword')
                ->setParameter('featureKeyword', $featureKeyword)
            ;
        }

        if (null == $categoryKeyword) {
            $results->innerJoin('f.featureCategory', 'fc');
        } else {
            $results
                ->innerJoin('f.featureCategory', 'fc', 'WITH', 'fc.keyword = :categoryKeyword')
                ->setParameter('categoryKeyword', $categoryKeyword)
            ;
        }

        return $results
            ->where("e.active = 1")
            ->andWhere('f.active = 1')
            ->setParameter('eventId', $id)
            ->getQuery()
            ->getResult();
    }

    public function findAllFeatureLinksByProductForWebsite(int $id, string $categoryKeyword = null, string $featureKeyword = null): array
    {
        $results = $this->createQueryBuilder('fl')
            ->addSelect('p')
            ->addSelect('f')
            ->addSelect('fc')
            ->innerJoin('fl.product', 'p', 'WITH', 'p.id = :productId')
        ;

        if (null == $featureKeyword) {
            $results->innerJoin('fl.feature', 'f');
        } else {
            $results
                ->innerJoin('fl.feature', 'f', 'WITH', 'f.keyword = :featureKeyword')
                ->setParameter('featureKeyword', $featureKeyword)
            ;
        }

        if (null == $categoryKeyword) {
            $results->innerJoin('f.featureCategory', 'fc');
        } else {
            $results
                ->innerJoin('f.featureCategory', 'fc', 'WITH', 'fc.keyword = :categoryKeyword')
                ->setParameter('categoryKeyword', $categoryKeyword)
            ;
        }

        return $results
            ->where("p.active = 1")
            ->andWhere('f.active = 1')
            ->setParameter('productId', $id)
            ->getQuery()
            ->getResult();
    }
}
