<?php

namespace App\Repository;

use App\Entity\Menu\MenuEntry;
use App\Entity\Language\Language;

use Doctrine\Persistence\ManagerRegistry;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

class MenuEntryRepository extends NestedTreeRepository
{
    public function findAllForAdmin(array $filters = [])
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

    public function findOneForAdmin(int $id)
    {
        return $this->createQueryBuilder('o')
            ->where('o.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function findTranslatedElementsForAdmin(array $languageGroupList, array $filters = [])
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

}
