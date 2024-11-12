<?php

namespace App\Repository;

use App\Entity\Order\DeliveryMode;
use Doctrine\Persistence\ManagerRegistry;

class DeliveryModeRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const SELECTS = [];
    protected const JOINS = [];
    protected const FILTERS = [];
    protected const SORTS = ['id' => 'o.id'];
    protected const IS_TRANSLATABLE = false;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DeliveryMode::class);
    }

    public function findAllForWebsite(): array
    {
        return $this
            ->createQueryBuilder('dm')
            ->where('dm.active = 1')
            ->orderBy('dm.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

}
