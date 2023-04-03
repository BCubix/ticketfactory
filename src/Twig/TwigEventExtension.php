<?php

namespace App\Twig;

use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Manager\EventDateManager;
use App\Manager\EventManager;
use App\Manager\LanguageManager;
use App\Utils\DateTimeFormatter;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class TwigEventExtension extends AbstractExtension
{
    protected $em;
    protected $edm;
    protected $lm;
    protected $rs;

    public function __construct(EventManager $em, EventDateManager $edm, LanguageManager $lm, RequestStack $rs)
    {
        $this->em  = $em;
        $this->edm = $edm;
        $this->lm = $lm;
        $this->rs = $rs;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('eventDatesStr', [$this, 'eventDatesStr']),
            new TwigFunction('eventPricesStr', [$this, 'eventPricesStr']),
            new TwigFunction('eventDateStateStr', [$this, 'eventDateStateStr'])
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
}
