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

    public function findDefaultForWebsite()
    {
        return $this->createQueryBuilder('l')
            ->where('l.active = 1')
            ->andWhere('l.isDefault = 1')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findByLocaleForWebsite($locale)
    {
        return $this->createQueryBuilder('l')
            ->where('l.active = 1')
            ->andWhere('l.locale = :locale')
            ->setParameter('locale', $locale)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
