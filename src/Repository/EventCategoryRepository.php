<?php

namespace App\Repository;

use App\Entity\Event\EventCategory;
use App\Entity\Language\Language;

use Doctrine\Persistence\ManagerRegistry;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class EventCategoryRepository extends NestedTreeRepository
{
    public function findAllForAdmin(array $filters = [], int $categoryId = null)
    {
        if (isset($filters['lang'])) {
            $langId = $filters['lang'];
        } else {
            $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultLanguageForAdmin()->getId();
        }

        if (null == $categoryId) {
            return $this->findRootCategory($langId);
        }

        return $this
            ->createQueryBuilder('o')
            ->where('o.id = :categoryId')
            ->setParameter('categoryId', $categoryId)
            ->getQuery()
            ->getOneOrNullResult()
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

    public function findRootCategory($languageId = null) {
        if (null === $languageId) {
            $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultLanguageForAdmin()->getId();
        } else {
            $langId = $languageId;
        }

        return $this
            ->createQueryBuilder('o')
            ->addSelect('el')
            ->leftJoin('o.lang', 'el')
            ->where('o.lvl = 0')
            ->andWhere('el.id = :languageId')
            ->setParameter('languageId', $langId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findOneByLanguageForAdmin(int $languageId, string $languageGroup)
    {
        $results = $this
            ->createQueryBuilder('o')
            ->addSelect('el')
            ->leftJoin('o.lang', 'el')
        ;

        return $results
            ->where('o.languageGroup = :languageGroup')
            ->setParameter('languageGroup', $languageGroup)
            ->andWhere('el.id = :languageId')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findAllByLanguageGroupForAdmin(string $languageGroup)
    {
        return $this
            ->createQueryBuilder('o')
            ->where('o.languageGroup = :languageGroup')
            ->setParameter('languageGroup', $languageGroup)
            ->getQuery()
            ->getResult()
        ;
    }
}
