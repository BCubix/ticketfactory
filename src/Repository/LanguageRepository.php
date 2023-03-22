<?php

namespace App\Repository;

use App\Entity\Language\Language;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class LanguageRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Language::class);
    }

    public function findDefaultForAdmin()
    {
        return $this->createQueryBuilder('l')
            ->where('l.isDefault = 1')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
