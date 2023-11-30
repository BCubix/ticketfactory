<?php

namespace App\Repository\Feature;

use App\Entity\Feature\FeatureCategory;

use Doctrine\Persistence\ManagerRegistry;

class FeatureCategoryRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const IS_TRANSLATABLE = true;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeatureCategory::class);
    }
}
