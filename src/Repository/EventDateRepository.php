<?php

namespace App\Repository;

use App\Entity\Event\EventDate;

use Doctrine\Persistence\ManagerRegistry;

class EventDateRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EventDate::class);
    }

    public function findDuplicatesForAdmin(EventDate $date)
    {
        $beginDate = $date->getEventDate();
        $endDate = clone $beginDate;
        $endDate->add(new \DateInterval('PT1H'));

        $dateId = $date->getId();
        $roomId = $date->getEvent()->getRoom()->getId();

        $results = $this->createQueryBuilder('ed')
            ->innerJoin('ed.event', 'e')
            ->innerJoin('e.room', 'r')
            ->where('ed.eventDate >= :beginDate')
            ->andWhere('ed.eventDate = :endDate')
            ->andWhere('r.id <> :roomId')
            ->setParameter('beginDate', $beginDate)
            ->setParameter('endDate', $endDate)
            ->setParameter('roomId', $roomId)
        ;

        if (null !== $dateId) {
            $results
                ->andWhere('ed.id <> :dateId')
                ->setParameter('dateId', $dateId)
            ;
        }

        return $results
            ->getQuery()
            ->getResult()
        ;
    }

    public function getCalendarForWebsite(\DateTime $beginDate, \DateTime $endDate, ?int $categoryId)
    {
        $results = $this
            ->createQueryBuilder('ed')
            ->addSelect('edb')
            ->addSelect('e')
            ->addSelect('ec')
            ->innerjoin('ed.eventDateBlock', 'edb')
            ->innerjoin('edb.event', 'e')
            ->innerjoin('e.eventCategories', 'ec')
            ->where('e.active = 1')
            ->andWhere('ec.active = 1')
            ->andWhere('(ed.eventDate BETWEEN :beginDate AND :endDate) OR (ed.reportDate BETWEEN :beginDate AND :endDate)')
        ;

        if (null !== $categoryId) {
            $results = $results
                ->andWhere('ec.id = :categoryId')
                ->setParameter('categoryId', $categoryId)
            ;
        }

        return $results
            ->setParameter('beginDate', $beginDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('ed.eventDate', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
}
