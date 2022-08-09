<?php

namespace App\Repository;

use App\Entity\EventCategory;

use Doctrine\Persistence\ManagerRegistry;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class EventCategoryRepository extends NestedTreeRepository
{
    public function findAllForAdmin(array $filters = [], int $categoryId = null)
    {
        if (null == $categoryId) {
            return $this->findRootCategory();
        }

        return $this
            ->createQueryBuilder('o')
            ->where('o.id = :categoryId')
            ->setParameter('categoryId', $categoryId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findRootCategory() {
        return $this
            ->createQueryBuilder('o')
            ->where('o.lvl = 0')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
