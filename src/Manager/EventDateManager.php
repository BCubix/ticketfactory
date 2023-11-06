<?php

namespace App\Manager;

use App\Entity\Event\EventDate;
use App\Kernel;
use App\Service\Formatter\DateTimeFormatter;
use App\Manager\ManagerFactory;
use App\Service\ServiceFactory;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class EventDateManager extends AbstractManager
{
    public const SERVICE_NAME = 'eventDate';

    protected $tr;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        TranslatorInterface $tr
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->tr = $tr;
    }

    public function getEventDateStateStr($eventDate): string
    {
        if ($eventDate->getState() == 'valid') {
            return '';
        }

        $eventDateStateStr = EventDate::STATES[$eventDate->getState()];

        if ($eventDate->getState() == 'delayed' && null !== $eventDate->getReportDate()) {
            $eventDateStateStr .= (' ' . $this->tr->trans('global.to') . ' ');
            $eventDateStateStr .= DateTimeFormatter::formatDate($eventDate->getReportDate(), $this->getLocale(), $this->tr->trans('global.date-format'));
        }

        return $eventDateStateStr;
    }

    public function groupDatesByMonth(Collection $dates): array
    {
        $months = [];

        foreach ($dates as $date) {
            $monthLabel = DateTimeFormatter::formatDate($date->getEventDate(), $this->getLocale(), 'MMMM Y');
            if (!isset($months[$monthLabel])) {
                $months[$monthLabel] = [];
            }

            $key = $date->getEventDate()->format('Y-m-d');
            $format = "EEEE d MMMM - HH'H'mm";
            $value = DateTimeFormatter::formatDateTime($date->getEventDate(), $this->getLocale(), $format);

            $now = new \DateTime();
            $className = 'dslider_date';

            if ($date->getEventDate() < $now) {
                $className .= ' passed';
            }

            if ($date->getEventDate()->format('Y-m-d') == $now->format('Y-m-d')) {
                $className .= ' present';
            }

            $months[$monthLabel][$key] = [$className, ucfirst($value)];
        }

        return $months;
    }
}
