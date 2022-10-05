<?php

namespace App\Repository;

use App\Entity\Media\Media;

use Doctrine\Persistence\ManagerRegistry;

class MediaRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Media::class);
    }
}
