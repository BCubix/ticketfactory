<?php

namespace App\Repository;

use App\Entity\ContentType;

use Doctrine\Persistence\ManagerRegistry;

class ContentTypeRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContentType::class);
    }
}
