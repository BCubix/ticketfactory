<?php

namespace App\Repository;

use App\Entity\Event\Tag;

use Doctrine\Persistence\ManagerRegistry;

class TagRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tag::class);
    }
}
