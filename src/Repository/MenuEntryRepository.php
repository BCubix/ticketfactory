<?php

namespace App\Repository;

use App\Entity\Menu\MenuEntry;
use App\Entity\Language\Language;

use Doctrine\Persistence\ManagerRegistry;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class MenuEntryRepository extends NestedTreeRepository
{
    public function findAllForAdmin(array $filters = []): array
    {
        if (isset($filters['lang'])) {
            $langId = $filters['lang'];
        } else {
            $langId = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin()->getId();
        }

        return $this
            ->createQueryBuilder('o')
            ->addSelect('el')
            ->leftJoin('o.lang', 'el')
            ->where('o.lvl = 0')
            ->andWhere('el.id = :languageId')
            ->setParameter('languageId', $langId)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findOneForAdmin(int $id): ?MenuEntry
    {
        return $this->createQueryBuilder('o')
            ->where('o.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findTranslatedElementsForAdmin(array $languageGroupList, array $filters = []): array
    {
        $defaultLanguage = $this->getEntityManager()->getRepository(Language::class)->findDefaultForAdmin();

        $results = $this
            ->createQueryBuilder('o')
            ->addSelect('el')
            ->leftJoin('o.lang', 'el')
        ;

        return $results
            ->andWhere('o.languageGroup IN (:languageGroupList)')
            ->setParameter('languageGroupList', $languageGroupList)
            ->orderBy('o.id', 'ASC')
            ->addOrderBy('o.languageGroup', "ASC")
            ->addOrderBy('el.isDefault', 'DESC')
            ->addOrderBy('el.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findAllForWebsite(int $languageId): array
    {
        return $this
            ->createQueryBuilder('me')
            ->innerJoin('me.lang', 'l', 'WITH', 'l.id = :languageId')
            ->orderBy('me.root, me.lft', 'ASC')
            ->setParameter('languageId', $languageId)
            ->getQuery()
            ->getArrayResult()
        ;
    }

    public function findByKeywordForWebsite(int $languageId, string $keyword): array
    {
        $root = $this
            ->createQueryBuilder('mc')
            ->innerJoin('mc.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('mc.keyword = :keyword')
            ->setParameter('languageId', $languageId)
            ->setParameter('keyword', $keyword)
            ->getQuery()
            ->getOneOrNullResult()
        ;

        if(null == $root) {
            return [];
        }

        return $this
            ->createQueryBuilder('mc')
            ->innerJoin('mc.lang', 'l', 'WITH', 'l.id = :languageId')
            ->where('mc.root = :root')
            ->andWhere('mc.lvl >= :lvl')
            ->andWhere('mc.lft > :lft')
            ->andWhere('mc.rgt < :rgt')
            ->orderBy('mc.root, mc.position', 'ASC')
            ->setParameter('languageId', $languageId)
            ->setParameter('root', $root->getRoot()->getId())
            ->setParameter('lvl', ($root->getLvl() + 1))
            ->setParameter('lft', $root->getLft())
            ->setParameter('rgt', $root->getRgt())
            ->getQuery()
            ->getResult()
        ;
    }
}
