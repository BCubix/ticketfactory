<?php

namespace App\Repository;

use App\Entity\Language\Language;
use Doctrine\ORM\QueryBuilder;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class AbstractNestedTreeRepository extends NestedTreeRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const CHILD_FILTERS = [
        ['name', 'c.name', 'search'],
        ['active', 'c.active', 'equals']
    ];

    protected function filterChildCategories(array $filters, $queryBuilder): QueryBuilder
    {
        $filter = "";
        $parameters = [];

        foreach (self::CHILD_FILTERS as $childFilter) {
            if (!isset($filters[$childFilter[0]]) || is_null($filters[$childFilter[0]])) {
                continue;
            }

            $filter .= ($filter !== "" ? " AND " : "") . $childFilter[1];
            switch ($childFilter[2]) {
                case "search":
                    $filter .= " LIKE :" . $childFilter[0];
                    $parameters[] = [$childFilter[0], "%" . $filters[$childFilter[0]] . '%'];

                    break;

                case "equals":
                default:
                    $filter .= " = :" . $childFilter[0];
                    $parameters[] = [$childFilter[0], $filters[$childFilter[0]]];

                    break;
            }
        }

        if ($filter !== "") {
            $queryBuilder->leftJoin('o.children', 'c', 'WITH', $filter);

            foreach ($parameters as $parameter) {
                $queryBuilder->setParameter($parameter[0], $parameter[1]);
            }

            return $queryBuilder;
        }

        return $queryBuilder->leftJoin('o.children', 'c');
    }

    public function findAllForAdmin(array $filters = [], int $categoryId = null): mixed
    {
        if (isset($filters['lang'])) {
            $langId = $filters['lang'];
        } else {
            $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin()->getId();
        }

        if (null == $categoryId) {
            $categoryId = $this->findRootCategory($langId)->getId();
        }

        $result = $this
            ->createQueryBuilder('o')
            ->addSelect('c');

        return $this->filterChildCategories($filters, $result)
            ->where('o.id = :categoryId')
            ->orderBy('c.position', 'ASC')
            ->setParameter('categoryId', $categoryId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneForAdmin(int $id): mixed
    {
        return $this->createQueryBuilder('o')
            ->where('o.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findRootCategory($languageId = null): mixed
    {
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
            ->getOneOrNullResult();
    }

    public function findOneByLanguageForAdmin(int $languageId, string $languageGroup): mixed
    {
        return $this
            ->createQueryBuilder('o')
            ->addSelect('el')
            ->leftJoin('o.lang', 'el')
            ->where('o.languageGroup = :languageGroup')
            ->setParameter('languageGroup', $languageGroup)
            ->andWhere('el.id = :languageId')
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
            ->addSelect('el')
            ->leftJoin('o.lang', 'el')
            ->andWhere('o.languageGroup IN (:languageGroupList)')
            ->setParameter('languageGroupList', $languageGroupList)
            ->orderBy('o.position', 'ASC')
            ->addOrderBy('o.languageGroup', "ASC")
            ->addOrderBy('el.isDefault', 'DESC')
            ->addOrderBy('el.id', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findAllByParentForAdmin(int $parendId): array
    {
        $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin()->getId();

        return $this
            ->createQueryBuilder('o')
            ->addSelect('el')
            ->leftJoin('o.lang', 'el')
            ->leftJoin('o.parent', 'p')
            ->andWhere("el.id = :languageId")
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

    public function findBySlugForWebsite(int $languageId, string $slug, bool $activeFilter = true): mixed
    {
        $result = $this->createQueryBuilder('s')
            ->innerJoin('s.lang', 'l', 'WITH', 'l.id = :languageId');

        if ($activeFilter) {
            $result = $result->where('s.active = 1');
        }

        return $result->andWhere('s.slug = :slug')
            ->setParameter('languageId', $languageId)
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findOneForWebsite(int $languageId, int $pageId): mixed
    {
        return $this->createQueryBuilder('ec')
            ->innerJoin('ec.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where("ec.active = 1")
            ->andWhere('ec.id = :pageId')
            ->setParameter('languageId', $languageId)
            ->setParameter('pageId', $pageId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getTopCategoriesForWebsite(int $languageId): array
    {
        return $this->createQueryBuilder('ec')
            ->innerJoin('ec.lang', 'ecl', 'WITH', 'ecl.id = :languageId')
            ->where('ec.lvl = 1')
            ->andWhere('ec.active = 1')
            ->orderBy('ec.id', 'ASC')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getResult();
    }

    public function findTranslationForWebsite(int $languageId, $languageGroup)
    {
        return $this->createQueryBuilder('e')
            ->innerJoin('e.lang', 'l')
            ->where('e.languageGroup = :languageGroup')
            ->andWhere('l.id = :languageId')
            ->setParameter('languageGroup', $languageGroup->toBinary())
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
