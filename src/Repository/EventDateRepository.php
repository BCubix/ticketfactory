<?php

namespace App\Repository;

use App\Entity\Event\EventDate;

use Doctrine\Persistence\ManagerRegistry;

class EventDateRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** > Module: Calendar ***/
    use \TicketFactory\Module\Calendar\Repository\Override\EventDateRepository;
    /*** < Module: Calendar ***/
    /*** < Trait ***/

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
            ->setParameter('roomId', $roomId);

        if (null !== $dateId) {
            $results
                ->andWhere('ed.id <> :dateId')
                ->setParameter('dateId', $dateId);
        }

        return $results
            ->getQuery()
            ->getResult();
    }

    public function findOneByIdForWebsite(int $id, ?int $eventId = null): ?EventDate
    {
        $result = $this->createQueryBuilder("ed")
            ->addSelect("edb")
            ->addSelect("e")
            ->innerJoin("ed.eventDateBlock", "edb")
            ->innerJoin("edb.event", "e", 'WITH', "e.active = 1")
            ->where("ed.id = :eventDateId")
            ->setParameter("eventDateId", $id);

        if (null !== $eventId) {
            $result = $result
                ->andWhere("e.id = :eventId")
                ->setParameter("eventId", $eventId);
        }

        return $result
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllByEventForWebsiteOption(int $eventId)
    {
        return $this->createQueryBuilder("ed")
            ->addSelect('edb')
            ->addSelect('e')
            ->innerjoin('ed.eventDateBlock', 'edb')
            ->innerjoin('edb.event', 'e')
            ->where('e.id = :eventId')
            ->setParameter("eventId", $eventId)
            ->orderBy("ed.eventDate", 'ASC');
    }

    public function findAllByEventForWebsite(int $eventId)
    {
        return $this->findAllByEventForWebsiteOption($eventId)
            ->getQuery()
            ->getResult();;
    }
}
