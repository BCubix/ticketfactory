<?php

namespace App\Repository;

use App\Entity\Language\Language;
use App\Entity\Media\MediaCategory;

use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class MediaCategoryRepository extends NestedTreeRepository
{
    public function findAllForAdmin(array $filters = [], int $categoryId = null)
    {
        if (isset($filters['lang'])) {
            $langId = $filters['lang'];
        } else {
            $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin()->getId();
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
            $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin()->getId();
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

    public function findTranslatedElementsForAdmin(array $languageGroupList, array $filters = [])
    {
        $results = $this
            ->createQueryBuilder('o')
            ->addSelect('el')
            ->leftJoin('o.lang', 'el')
        ;

        return $results
            ->andWhere('o.languageGroup IN (:languageGroupList)')
            ->setParameter('languageGroupList', $languageGroupList)
            ->addOrderBy('o.id', 'ASC')
            ->addOrderBy('o.languageGroup', "ASC")
            ->addOrderBy('el.isDefault', 'DESC')
            ->addOrderBy('el.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
}
