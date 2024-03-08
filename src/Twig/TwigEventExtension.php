<?php

namespace App\Twig;

use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventMedia;
use App\Manager\EventDateManager;
use App\Manager\EventManager;
use App\Manager\FeatureManager;
use App\Manager\LanguageManager;
use App\Service\Formatter\DateTimeFormatter;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class TwigEventExtension extends AbstractExtension
{
    protected $em;
    protected $edm;
    protected $lm;
    protected $rs;
    protected $fm;

    public function __construct(EventManager $em, EventDateManager $edm, LanguageManager $lm, RequestStack $rs, FeatureManager $fm)
    {
        $this->em  = $em;
        $this->edm = $edm;
        $this->lm = $lm;
        $this->rs = $rs;
        $this->fm = $fm;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('eventDatesStr', [$this, 'eventDatesStr']),
            new TwigFunction('eventPricesStr', [$this, 'eventPricesStr']),
            new TwigFunction('eventDateStateStr', [$this, 'eventDateStateStr']),
            new TwigFunction('nextSubDates', [$this, 'nextSubDates']),
            new TwigFunction('groupDatesByMonth', [$this, 'groupDatesByMonth']),
            new TwigFunction('getMainImageFromEvent', [$this, 'getMainImageFromEvent']),
            new TwigFunction('getFirstFormattedMediaForEvent', [$this, 'getFirstFormattedMediaForEvent']),
            new TwigFunction('getEventFeatures', [$this, 'getEventFeatures']),
            new TwigFunction('getAllFormattedMediasForEvent', [$this, 'getAllFormattedMediasForEvent']),
        ];
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('formatDatetime', [$this, 'formatDatetime']),
            new TwigFilter('formatDate', [$this, 'formatDate']),
            new TwigFilter('formatTime', [$this, 'formatTime'])
        ];
    }

    public function eventDatesStr(Event $event): string
    {
        $locale = $this->rs->getMainRequest()->getLocale();
        $language = $this->lm->getLanguageFromLocale($locale);

        return $this->em->getEventDatesStr($event, $language->getDatetimeFormat());
    }

    public function eventPricesStr(Event $event): string
    {
        return $this->em->getEventPricesStr($event);
    }

    public function eventDateStateStr(EventDate $eventDate): string
    {
        return $this->edm->getEventDateStateStr($eventDate);
    }

    public function nextSubDates(Collection $dates, int $limit): array
    {
        $nextDates = [];
        $now = new \DateTime();

        foreach ($dates as $date) {
            if ($date->getEventDate() > $now) {
                $nextDates[] = $date;

                if (count($nextDates) >= $limit) {
                    return $nextDates;
                }
            }
        }

        return $nextDates;
    }

    public function groupDatesByMonth(Collection $dates): array
    {
        return $this->edm->groupDatesByMonth($dates);
    }

    public function formatDateTime(\DateTime $dateTime, string $format = null): string
    {
        $locale = $this->rs->getMainRequest()->getLocale();
        $language = $this->lm->getLanguageFromLocale($locale);
        $format ??= $language->getDatetimeFormat();

        return DateTimeFormatter::formatDateTime($dateTime, $locale, $format);
    }

    public function formatDate(\DateTime $date, string $format = null): string
    {
        $locale = $this->rs->getMainRequest()->getLocale();
        $language = $this->lm->getLanguageFromLocale($locale);
        $format ??= $language->getDateFormat();

        return DateTimeFormatter::formatDate($date, $locale, $format);
    }

    public function formatTime(\DateTime $time, string $format = null): string
    {
        $locale = $this->rs->getMainRequest()->getLocale();
        $language = $this->lm->getLanguageFromLocale($locale);
        $format ??= $language->getTimeFormat();

        return DateTimeFormatter::formatTime($time, $locale, $format);
    }

    public function getFirstFormattedMediaForEvent($eventMedias, string $slug): ?EventMedia
    {
        if (count($eventMedias) === 0) {
            return null;
        }

        if (null === $slug) {
            return $eventMedias[0];
        }

        return $this->em->getFirstFormattedMedia($eventMedias, $slug);
    }

    public function getEventFeatures(Event $event, string $categoryKeyword = null, string $featureKeyword = null)
    {
        return $this->fm->getEventFeatures($event, $categoryKeyword, $featureKeyword);
    }

    public function getAllFormattedMediasForEvent($eventMedias, string $slug): array
    {
        if (count($eventMedias) === 0) {
            return [];
        }

        if (null === $slug) {
            return $eventMedias;
        }

        return $this->em->getAllFormattedMedias($eventMedias, $slug);
    }
}
