<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Manager\AbstractManager;
use App\Service\Formatter\DateTimeFormatter;
use DateInterval;

class EventSorterManager extends AbstractManager
{
    public const SERVICE_NAME = 'eventSorter';

    public const FIRST_DATE = 'first';
    public const LAST_DATE = 'last';

    public const OBJECT_DATE = 'object';
    public const STRING_DATE = 'value';

    public const MIN_MONTH_DATE = 3;
    public const MAX_MONTH_DATE = 12;

    public function getNextMonths(\DateTime $today): array
    {
        $months = [];
        $currentMonth = clone $today;
        $currentMonth->setDate($currentMonth->format('y'), $currentMonth->format('m'), 1);
        $currentMonth->setTime(0, 0, 0);

        for ($i = 0; $i < self::MAX_MONTH_DATE; $i++) {
            $monthLabel = ucfirst(DateTimeFormatter::formatDate($currentMonth, 'fr', "MMMM y"));
            $monthValue = $currentMonth->format('y-m');

            $months[$monthLabel] = $monthValue;

            $currentMonth->add(new \DateInterval('P1M'));
        }

        return $months;
    }

    public function getReferenceDate($event, $firstLastDate = self::FIRST_DATE, $objectString = self::OBJECT_DATE): mixed
    {
        $dates = $event->getEventDates();

        if (count($dates) == 0) {
            return null;
        }

        $referenceDate = null;
        $referenceDateVal = null;
        foreach ($dates as $date) {
            $currentDate = $date->getEventDate();

            if ($date->getState() == 'canceled') {
                continue;
            }

            if ($date->getState() == 'delayed' && null !== $date->getReportDate()) {
                $currentDate = $date->getReportDate();
            }

            if (
                ($firstLastDate == self::FIRST_DATE && ($referenceDateVal === null || $referenceDateVal > $currentDate)) ||
                ($firstLastDate == self::LAST_DATE && ($referenceDateVal === null || $referenceDateVal < $currentDate))
            ) {
                $referenceDateVal = $currentDate;
                $referenceDate = clone $date;
            }
        }

        if (null == $referenceDate) {
            foreach ($dates as $date) {
                $currentDate = $date->getEventDate();

                if (
                    ($firstLastDate == self::FIRST_DATE && ($referenceDateVal === null || $referenceDateVal > $currentDate)) ||
                    ($firstLastDate == self::LAST_DATE && ($referenceDateVal === null || $referenceDateVal < $currentDate))
                ) {
                    $referenceDateVal = $currentDate;
                    $referenceDate = $date;
                }
            }
        }

        return ($objectString == self::OBJECT_DATE ? $referenceDate : $referenceDateVal);
    }

    public function sortEvents(array $events, ?bool $withActiveSort = false, ?string $sortField = 'beginDate', ?string $sortOrder = 'ASC', ?int $page = null, ?int $limit = null): array
    {
        if (null === $events) {
            return null;
        }

        usort($events, function ($a, $b) use ($sortField, $sortOrder) {
            return $this->compareEvents($a, $b, $sortField, $sortOrder);
        });

        if ($withActiveSort) {
            return $this->sortActiveEvents($events, $page, $limit);
        }

        if (null === $limit || $page === -1) {
            return $events;
        }

        $page = $page ?? 1;
        return [
            'total' => count($events),
            'events' => array_slice($events, ($page - 1) * $limit, $limit),
        ];
    }

    public function getBeginDate(Event $event, $objectString = self::STRING_DATE)
    {
        return $this->getReferenceDate($event, self::FIRST_DATE, $objectString);
    }

    public function getEndDate(Event $event, $objectString = self::STRING_DATE)
    {
        return $this->getReferenceDate($event, self::LAST_DATE, $objectString);
    }

    public function isEventOver($event): bool
    {
        $additionalTime = $this->mf->get('parameter')->getCoreParameter('event_additional_time') ?? 0;
        $endDate = clone $this->getEndDate($event);

        $endDate->add(new DateInterval('PT' . $additionalTime . 'H'));

        return $endDate < new \DateTime();
    }

    private function sortActiveEvents($events, ?int $page = null, ?int $limit = null): array
    {
        $additionalTime = $this->mf->get('parameter')->getCoreParameter('event_additional_time') ?? 0;
        $sortedEvents = ['active' => [], 'inactive' => []];

        $now = new \Datetime();
        foreach ($events as $event) {
            $end = clone $this->getEndDate($event);
            $end->add(new \DateInterval('PT' . $additionalTime . 'H'));

            if ($now < $end) {
                array_push($sortedEvents['active'], $event);
            } else {
                array_push($sortedEvents['inactive'], $event);
            }
        }

        if (null === $limit || $page === -1) {
            return $sortedEvents;
        }

        $page = $page ?? 1;

        $sortedEvents['activeTotal'] = count($sortedEvents['active']);
        $sortedEvents['active'] = array_slice($sortedEvents['active'], ($page - 1) * $limit, $limit);

        $sortedEvents['inactiveTotal'] = count($sortedEvents['inactive']);
        $sortedEvents['inactive'] = array_slice($sortedEvents['inactive'], ($page - 1) * $limit, $limit);

        return $sortedEvents;
    }

    private function getSortList(): array
    {
        return [
            'name' => [fn($element) => $element->getName()],
            'beginDate' => [fn($element) => $this->getBeginDate($element)],
            'hour' => [
                function ($element) {
                    $date = clone $this->getBeginDate($element);
                    $date->setDate(1970, 1, 1);
                    return $date;
                }
            ]
        ];
    }

    private function compareEvents($a, $b, $sortField, $sortOrder)
    {
        $sortDirection = $sortOrder === "ASC" ? 1 : -1;
        $sortList = $this->getSortList();

        $compareA = $sortList[$sortField][0]($a);
        $compareB = $sortList[$sortField][0]($b);

        if (isset($sortList[$sortField][1])) {
            return $sortList[$sortField][1]($a, $b) * $sortDirection;
        }

        if ($compareA == $compareB) {
            return 0;
        }

        if ($compareA > $compareB) {
            return $sortDirection;
        }

        return $sortDirection * -1;
    }
}
