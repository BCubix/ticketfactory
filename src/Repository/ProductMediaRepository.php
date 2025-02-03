<?php

namespace App\Repository;

use App\Entity\Product\ProductMedia;

use Doctrine\Persistence\ManagerRegistry;

class ProductMediaRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProductMedia::class);
    }
}
