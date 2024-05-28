<?php

namespace App\Repository;

use App\Entity\Order\OrderStatus;
use Doctrine\Persistence\ManagerRegistry;

class OrderStatusRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OrderStatus::class);
    }

    public function findOneByKeywordForWebsite(string $keyword): ?OrderStatus
    {
        return $this->createQueryBuilder("os")
            ->where("os.keyword = :keyword")
            ->setParameter("keyword", $keyword)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
