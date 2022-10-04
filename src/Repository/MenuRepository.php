<?php

namespace App\Repository;

use App\Entity\Menu;

use Doctrine\Persistence\ManagerRegistry;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class MenuEntryRepository extends NestedTreeRepository
{
    public function findAllForAdmin(array $filters = [])
    {
        return $this
            ->createQueryBuilder('o')
            ->where('o.lvl = 0')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findOneForAdmin(int $id)
    {
        return $this->createQueryBuilder('o')
            ->where('o.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
