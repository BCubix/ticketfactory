<?php

namespace App\Repository;

use App\Entity\Product\ProductCategory;
use App\Entity\Language\Language;

use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class ProductCategoryRepository extends NestedTreeRepository
{
    public function findAllForAdmin(array $filters = [], int $categoryId = null): ?ProductCategory
    {
        if (isset($filters['lang'])) {
            $langId = $filters['lang'];
        } else {
            $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin()->getId();
        }

        if (null == $categoryId) {
            $categoryId = $this->findRootCategory($langId)->getId();
        }

        return $this
            ->createQueryBuilder('o')
            ->addSelect('c')
            ->leftJoin('o.children', 'c')
            ->where('o.id = :categoryId')
            ->orderBy('c.position', 'ASC')
            ->setParameter('categoryId', $categoryId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneForAdmin(int $id): ?ProductCategory
    {
        return $this->createQueryBuilder('o')
            ->where('o.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findRootCategory($languageId = null): ?ProductCategory
    {
        if (null === $languageId) {
            $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin()->getId();
        } else {
            $langId = $languageId;
        }

        return $this
            ->createQueryBuilder('o')
            ->addSelect('pl')
            ->leftJoin('o.lang', 'pl')
            ->where('o.lvl = 0')
            ->andWhere('pl.id = :languageId')
            ->setParameter('languageId', $langId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneByLanguageForAdmin(int $languageId, string $languageGroup): ?ProductCategory
    {
        return $this
            ->createQueryBuilder('o')
            ->addSelect('pl')
            ->leftJoin('o.lang', 'pl')
            ->where('o.languageGroup = :languageGroup')
            ->setParameter('languageGroup', $languageGroup)
            ->andWhere('pl.id = :languageId')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllByLanguageGroupForAdmin(string $languageGroup): array
    {
        return $this
            ->createQueryBuilder('o')
            ->where('o.languageGroup = :languageGroup')
            ->setParameter('languageGroup', $languageGroup)
            ->getQuery()
            ->getResult();
    }

    public function findTranslatedElementsForAdmin(array $languageGroupList, array $filters = []): array
    {
        return $this
            ->createQueryBuilder('o')
            ->addSelect('pl')
            ->leftJoin('o.lang', 'pl')
            ->andWhere('o.languageGroup IN (:languageGroupList)')
            ->setParameter('languageGroupList', $languageGroupList)
            ->orderBy('o.position', 'ASC')
            ->addOrderBy('o.languageGroup', "ASC")
            ->addOrderBy('pl.isDefault', 'DESC')
            ->addOrderBy('pl.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findAllByParentForAdmin(int $parendId): array
    {
        $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin()->getId();

        return $this
            ->createQueryBuilder('o')
            ->addSelect('pl')
            ->leftJoin('o.lang', 'pl')
            ->leftJoin('o.parent', 'p')
            ->andWhere("pl.id = :languageId")
            ->setParameter('languageId', $langId)
            ->andWhere("p.id = :parentId")
            ->setParameter('parentId', $parendId)
            ->orderBy('o.position', "ASC")
            ->getQuery()
            ->getResult();
    }

    public function findAllTranslationsByElementForAdmin(string $languageGroup): array
    {
        $defaultLanguage = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin();

        return $this->createQueryBuilder('o')
            ->leftJoin('o.lang', 'l')
            ->where('o.languageGroup = :languageGroup')
            ->setParameter('languageGroup', $languageGroup)
            ->andWhere("l.id != :defaultLanguageId")
            ->setParameter("defaultLanguageId", $defaultLanguage->getId())
            ->getQuery()
            ->getResult();
    }

    public function findMaxPositionForAdmin(?int $parentId): array
    {
        $defaultLanguage = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin();

        return $this->createQueryBuilder('o')
            ->leftJoin("o.lang", "l")
            ->leftJoin('o.parent', 'p')
            ->where("l.id = :langId")
            ->setParameter("langId", $defaultLanguage->getId())
            ->andWhere('p.id = :parentId')
            ->setParameter("parentId", $parentId)
            ->setMaxResults(1)
            ->orderBy('o.position', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function getTopCategoriesForWebsite(int $languageId): array
    {
        return $this->createQueryBuilder('pc')
            ->innerJoin('pc.lang', 'pcl', 'WITH', 'pcl.id = :languageId')
            ->where('pc.lvl = 1')
            ->andWhere('pc.active = 1')
            ->orderBy('pc.id', 'ASC')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getResult();
    }

    public function findBySlugForWebsite(int $languageId, string $slug): ?ProductCategory
    {
        return $this->createQueryBuilder('s')
            ->innerJoin('s.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('s.active = 1')
            ->andWhere('s.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
