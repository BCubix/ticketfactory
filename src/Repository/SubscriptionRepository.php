<?php

namespace App\Repository;

use App\Entity\Subscription\Subscription;
use App\Repository\CrudRepository;

use Doctrine\Persistence\ManagerRegistry;

class SubscriptionRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const SELECTS = [
        'el' => null
    ];

    protected const JOINS = [
        ['innerJoin', 'o.lang', 'el']
    ];

    protected const IS_TRANSLATABLE = true;

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
        ['lang', 'el.id', 'in'],
        ['languageGroup', 'o.languageGroup', 'equals']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Subscription::class);
    }

    public function findAllForWebsite(int $languageId): array
    {
        $results = $this->createQueryBuilder('s')
            ->innerJoin('s.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where("s.active = 1");

        $beginDateX = $results->expr()->orX('s.beginDate IS NULL', 's.beginDate < :now');
        $endDateX = $results->expr()->orX('s.endDate IS NULL', 's.endDate > :now');

        return $results
            ->andWhere($beginDateX)
            ->andWhere($endDateX)
            ->orderBy('s.id', 'ASC')
            ->setParameter('languageId', $languageId)
            ->setParameter('now', new \DateTime())
            ->getQuery()
            ->getResult();
    }

    public function findOneForWebsite(int $subscriptionId): ?Subscription
    {
        return $this->createQueryBuilder('s')
            ->where('s.active = 1')
            ->andWhere('s.id = :subscriptionId')
            ->setParameter('subscriptionId', $subscriptionId)
            ->getQuery()
            ->getOneOrNullResult();
    }

}
