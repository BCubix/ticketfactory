<?php

namespace App\Repository;

use App\Entity\Feature\FeatureValue;

use Doctrine\Persistence\ManagerRegistry;

class FeatureValueRepository extends AbstractRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeatureValue::class);
    }
}
