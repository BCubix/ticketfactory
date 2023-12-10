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

    public function findAllFeatureLinksByEventForWebsite(int $id, string $keyword): array
    {
        return $this->createQueryBuilder('fl')
            ->addSelect('e')
            ->addSelect('f')
            ->addSelect('fc')
            ->innerJoin('fl.event', 'e', 'WITH', 'e.id = :eventId')
            ->innerJoin('fl.feature', 'f')
            ->innerJoin('f.featureCategory', 'fc', 'WITH', 'fc.keyword = :keyword')
            ->where("e.active = 1")
            ->andWhere('f.active = 1')
            ->setParameter('eventId', $id)
            ->setParameter('keyword', $keyword)
            ->getQuery()
            ->getResult();
    }

    public function findAllFeatureLinksByProductForWebsite(int $id, string $keyword): array
    {
        return $this->createQueryBuilder('fl')
            ->addSelect('p')
            ->addSelect('f')
            ->addSelect('fc')
            ->innerJoin('fl.product', 'p', 'WITH', 'e.id = :productId')
            ->innerJoin('fl.feature', 'f')
            ->innerJoin('f.featureCategory', 'fc', 'WITH', 'fc.keyword = :keyword')
            ->where("p.active = 1")
            ->andWhere('f.active = 1')
            ->setParameter('productId', $id)
            ->setParameter('keyword', $keyword)
            ->getQuery()
            ->getResult();
    }
}
