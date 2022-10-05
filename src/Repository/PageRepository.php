<?php

namespace App\Repository;

use App\Entity\Page\Page;

use Doctrine\Persistence\ManagerRegistry;

class PageRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Page::class);
    }
}
