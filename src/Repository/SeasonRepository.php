<?php

namespace App\Repository;

use App\Entity\Event\Season;

use Doctrine\Persistence\ManagerRegistry;

class SeasonRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Season::class);
    }
}
