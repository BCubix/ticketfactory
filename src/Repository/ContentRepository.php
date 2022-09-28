<?php

namespace App\Repository;

use App\Entity\Content\Content;

use Doctrine\Persistence\ManagerRegistry;

class ContentRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Content::class);
    }
}
