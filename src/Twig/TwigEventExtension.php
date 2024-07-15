<?php

namespace App\Twig;

use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventMedia;
use App\Manager\ManagerFactory;
use App\Service\Formatter\DateTimeFormatter;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class TwigEventExtension extends AbstractExtension
{
    protected $rs;
    protected $mf;


    public function __construct(RequestStack $rs, ManagerFactory $mf)
    {
        $this->rs = $rs;
        $this->mf = $mf;
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
            new TwigFunction('getDisplayBookingButton', [$this, 'getDisplayBookingButton']),
            new TwigFunction('getEventTicketingType', [$this, 'getEventTicketingType']),
            new TwigFunction('getEventIframeLink', [$this, 'getEventIframeLink']),
            new TwigFunction('getEventExternalLink', [$this, 'getEventExternalLink']),
            new TwigFunction('getEventBeginDate', [$this, 'getEventBeginDate']),
            new TwigFunction('getEventEndDate', [$this, 'getEventEndDate']),
            new TwigFunction('isEventOver', [$this, 'isEventOver']),
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
        $language = $this->mf->get('language')->getLanguageFromLocale($locale);

        return $this->mf->get('event')->getEventDatesStr($event, $language->getDatetimeFormat());
    }

    public function eventPricesStr(Event $event): string
    {
        return $this->mf->get('event')->getEventPricesStr($event);
    }

    public function eventDateStateStr(EventDate $eventDate): string
    {
        return $this->mf->get('eventDate')->getEventDateStateStr($eventDate);
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
        return $this->mf->get('eventDate')->groupDatesByMonth($dates);
    }

    public function formatDateTime(\DateTime $dateTime, string $format = null): string
    {
        $locale = $this->rs->getMainRequest()->getLocale();
        $language = $this->mf->get('language')->getLanguageFromLocale($locale);
        $format ??= $language->getDatetimeFormat();

        return DateTimeFormatter::formatDateTime($dateTime, $locale, $format);
    }

    public function formatDate(\DateTime $date, string $format = null): string
    {
        $locale = $this->rs->getMainRequest()->getLocale();
        $language = $this->mf->get('language')->getLanguageFromLocale($locale);
        $format ??= $language->getDateFormat();

        return DateTimeFormatter::formatDate($date, $locale, $format);
    }

    public function formatTime(\DateTime $time, string $format = null): string
    {
        $locale = $this->rs->getMainRequest()->getLocale();
        $language = $this->mf->get('language')->getLanguageFromLocale($locale);
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

        return $this->mf->get('event')->getFirstFormattedMedia($eventMedias, $slug);
    }

    public function getEventFeatures(Event $event, string $categoryKeyword = null, string $featureKeyword = null)
    {
        return $this->mf->get('feature')->getEventFeatures($event, $categoryKeyword, $featureKeyword);
    }

    public function getAllFormattedMediasForEvent($eventMedias, ?string $slug): array
    {
        if (count($eventMedias) === 0) {
            return [];
        }

        return $this->mf->get('event')->getAllFormattedMedias($eventMedias, $slug);
    }

    public function getDisplayBookingButton(Event $event): bool
    {
        return $this->mf->get('event')->getDisplayBookingButton($event);
    }

    public function getEventTicketingType(Event $event): ?string
    {
        if (null === $event->getTicketing()) {
            return null;
        }

        return $event->getTicketing()->getType();
    }

    public function getEventIframeLink(Event $event): ?string
    {
        return $this->mf->get('event')->getEventIframeLink($event);
    }


    public function getEventExternalLink(Event $event): ?string
    {
        return $this->mf->get('event')->getEventExternalLink($event);
    }

    public function getEventBeginDate(Event $event)
    {
        return $this->mf->get('eventSorter')->getBeginDate($event);
    }

    public function getEventEndDate(Event $event)
    {
        return $this->mf->get('eventSorter')->getEndDate($event);
    }

    public function isEventOver(Event $event)
    {
        return $this->mf->get('eventSorter')->isEventOver($event);
    }
}
