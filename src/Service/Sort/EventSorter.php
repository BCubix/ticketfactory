<?php

namespace App\Service\Sort;

use App\Entity\Event\Event;
use App\Entity\Event\EventDate;

class EventSorter
{
    public const FIRST_DATE = 'first';
    public const LAST_DATE = 'last';

    public const OBJECT_DATE = 'object';
    public const STRING_DATE = 'value';

    public const MIN_MONTH_DATE = 3;
    public const MAX_MONTH_DATE = 12;

    public static function getNextMonths(\DateTime $today): array
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

    public static function getReferenceDate($event, $firstLastDate = self::FIRST_DATE, $objectString = self::OBJECT_DATE): mixed
    {
        $dates = [];
        foreach ($event->getEventDateBlocks() as $dateBlock) {
        	foreach ($dateBlock->getEventDates() as $eventDate) {
        		$dates[] = $eventDate;
        	}
        }

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
                $referenceDate = $date;
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

    public static function sortEvents($events, $withActiveSort = false): array
    {
        if (null === $events) {
            return null;
        }

        usort($events, function($a, $b) {
            if ($a->getBeginDate() == $b->getBeginDate()) {
                return 0;
            }

            if ($a->getBeginDate() > $b->getBeginDate()) {
                return 1;
            }

            return -1;
        });

        if ($withActiveSort) {
            return self::sortActiveEvents($events);
        }

        return $events;
    }

    private static function sortActiveEvents($events): array
    {
        $sortedEvents = ['active' => [], 'inactive' => []];

        $now = new \Datetime();
        foreach ($events as $event)
        {
            $end = clone $event->getEndDate();
            $end->add(new \DateInterval('P1D'))->setTime(0, 0, 0);

            if ($now < $end) {
                array_push($sortedEvents['active'], $event);
            } else {
                array_push($sortedEvents['inactive'], $event);
            }
        }

        return $sortedEvents;
    }
}
