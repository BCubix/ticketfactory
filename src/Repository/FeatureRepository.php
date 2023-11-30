<?php

namespace App\Repository;

use App\Entity\Feature;

use Doctrine\Persistence\ManagerRegistry;

class FeatureRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const IS_TRANSLATABLE = true;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Feature::class);
    }
}
