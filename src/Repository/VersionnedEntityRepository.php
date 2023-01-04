<?php

namespace App\Repository;

use App\Entity\VersionnedEntity\VersionnedEntity;

use Doctrine\Persistence\ManagerRegistry;

class VersionnedEntityRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VersionnedEntity::class);
    }

    public function findEntityVersionsForAdmin($entityKeyword, $entityId): array
    {
        return $this
            ->createQueryBuilder('ve')
            ->where('ve.entityKeyword = :entityKeyword')
            ->andWhere('ve.entityId = :entityId')
            ->orderBy('ve.revisionDate', 'ASC')
            ->setParameter('entityKeyword', $entityKeyword)
            ->setParameter('entityId', $entityId)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findEntityVersionForAdmin($entityKeyword, $versionId): ?VersionnedEntity
    {
        return $this
            ->createQueryBuilder('ve')
            ->where('ve.entityKeyword = :entityKeyword')
            ->andWhere('ve.id = :versionId')
            ->orderBy('ve.revisionDate', 'ASC')
            ->setParameter('entityKeyword', $entityKeyword)
            ->setParameter('versionId', $versionId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
