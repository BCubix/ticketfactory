<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventMedia;
use App\Entity\Event\EventPrice;
use App\Entity\Event\EventPriceCategory;
use App\Entity\Media\ImageFormat;
use App\Kernel;
use App\Service\ServiceFactory;
use App\Service\File\MimeTypeMapping;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class EventManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'event';
    protected const ENTITY_CLASS = Event::class;
    private const WEBSITE_SORTS = [
        'nameAsc' => ['name', 'ASC'],
        'nameDesc' => ['name', 'DESC'],
        'chronoAsc' => ['beginDate', 'ASC'],
        'chronoDesc' => ['beginDate', 'DESC'],
        'hourAsc' => ['hour', 'ASC'],
        'hourDesc' => ['hour', 'DESC']
    ];

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

    public function getObjectFromUrl(string $url, string $urlFormat, bool $activeFilter): ?array
    {
        $regexPattern = '#^' . preg_replace('/%([^%]+)%/', '(?P<$1>[^/]+)', $urlFormat) . '$#';
        if (!preg_match($regexPattern, $url, $matches)) {
            return null;
        }

        $formatValue = null;
        foreach (static::UNIQ_IDENTIFIER as $eventIdentifier) {
            if (isset($matches[$eventIdentifier])) {
                $formatValue = $matches[$eventIdentifier];
                break;
            }
        }

        $languageId = $this->getLanguageId();

        $result = [];

        if (null !== $formatValue) {
            $result[$this->entityClassName] = $this->getObjectFromFormat($formatValue, $eventIdentifier, $languageId, $activeFilter);
            if (null === $result[$this->entityClassName]) {
                return null;
            }

            $checkLinkedContentUrl = $this->getEventLinkTab();

            foreach ($matches as $key => $value) {
                if (!isset($checkLinkedContentUrl[$key])) {
                    continue;
                }

                if ($key === $this->entityClassName) {
                    return null;
                }

                $result[$key] = $checkLinkedContentUrl[$key]($result[$this->entityClassName], $value);

                if (null === $result[$key] || $result[$key] === false) {
                    return null;
                }
            }
        } else {
            $checkLinkedContentUrl = $this->getContentLinkTab();

            foreach ($matches as $key => $value) {
                if (!isset($checkLinkedContentUrl[$key])) {
                    continue;
                }

                $result[$key] = $checkLinkedContentUrl[$key]($languageId, $value, $activeFilter);

                if (null === $result[$key] || $result[$key] === false) {
                    return null;
                }
            }
        }

        return $result;
    }

    protected function getEventLinkTab(): array
    {
        return [
            'EventCategory' => fn($event, $value) => $event->getMainCategory() && $event->getMainCategory()->getSlug() === $value ? $event->getMainCategory() : null,
            'Season' => fn($event, $value) => $event->getSeason() && $event->getSeason()->getSlug() === $value ? $event->getSeason() : null,
            'Room' => fn($event, $value) => $event->getRoom() && $event->getRoom()->getSlug() === $value ? $event->getRoom() : null,
            'year' => fn($event, $value) => $this->mf->get('eventSorter')->getBeginDate($event)->format('Y') === $value ? $this->mf->get('eventSorter')->getBeginDate($event)->format('Y') : null,
            'month' => fn($event, $value) => $this->mf->get('eventSorter')->getBeginDate($event)->format('m') === $value ? $this->mf->get('eventSorter')->getBeginDate($event)->format('m') : null,
            'day' => fn($event, $value) => $this->mf->get('eventSorter')->getBeginDate($event)->format('d') === $value ? $this->mf->get('eventSorter')->getBeginDate($event)->format('d') : null,
        ];
    }

    protected function getBuildContentLinkTab(): array
    {
        return [
            'EventCategory' => fn($element) => null !== $element->getMainCategory() ? $element->getMainCategory()->getSlug() : null,
            'Season' => fn($element) => $element->getSeason() ? $element->getSeason()->getSlug() : null,
            'Room' => fn($element) => $element->getRoom() ? $element->getRoom()->getSlug() : null,
            'year' => fn($element) => $this->mf->get('eventSorter')->getBeginDate($element)->format('Y'),
            'month' => fn($element) => $this->mf->get('eventSorter')->getBeginDate($element)->format('m'),
            'day' => fn($element) => $this->mf->get('eventSorter')->getBeginDate($element)->format('d')
        ];
    }

    protected function getBuildContentTab(): array
    {
        return [
            'EventCategory' => fn($parameters) => isset($parameters['eventCategory']) ? $parameters['eventCategory']->getSlug() : null,
            'Season' => fn($parameters) => isset($parameters['season']) ? $parameters['season']->getSlug() : null,
            'Room' => fn($parameters) => isset($parameters['room']) ? $parameters['room']->getSlug() : null,
        ];
    }

    public function getEventPricesReservationDefault(Event $event): array
    {
        $defaultPrices = [];
        $eventPrices = $this->em->getRepository(EventPrice::class)->findAllByEventForWebsite($event->getId());

        foreach ($eventPrices as $eventPrice) {
            $defaultPrices[] = [
                "eventPrice" => $eventPrice,
                "quantity" => 0,
            ];
        }
        return $defaultPrices;
    }

    public function getEvents(array $filters): array
    {
        $events = $this->em->getRepository(Event::class)->findAllForWebsite($this->getLanguageId(), $filters);

        // Dates
        foreach ($events as &$event) {
            $eventDates = $this->em->getRepository(EventDate::class)->findAllByEventForWebsiteOption($event->getId());
            foreach ($eventDates as $eventDate) {
                $event->addEventDate($eventDate);
            }

            $event->frontBookingButton = $this->getDisplayBookingButton($event);
        }

        return $events;
    }

    public function getSortedEvents(array $filters): array
    {
        [$sortField, $sortOrder] = $this->getDefaultParameters($filters);
        $page = $filters['page'] ?? null;
        $limit = $filters['limit'] ?? null;

        $events = $this->getEvents($filters);

        return $this->mf->get('eventSorter')->sortEvents($events, true, $sortField, $sortOrder, $page, $limit);
    }

    public function getUrlSlugs(Event $event): array
    {
        $url = $this->mf->get('parameter')->getCoreParameter('event_url_format');
        $eventUrlConstruct = [
            '%id%' => fn($event) => $event->getId(),
            '%slug%' => fn($event) => $event->getSlug(),
            '%category%' => fn($event) => $event->getMainCategory() ? $event->getMainCategory()->getSlug() : '',
            '%season%' => fn($event) => $event->getSeason() ? $event->getSeason()->getSlug() : '',
            '%room%' => fn($event) => $event->getRoom() ? $event->getRoom()->getSlug() : '',
            '%year%' => fn($event) => $this->mf->get('eventSorter')->getBeginDate($event)->format('Y'),
            '%month%' => fn($event) => $this->mf->get('eventSorter')->getBeginDate($event)->format('m'),
            '%day%' => fn($event) => $this->mf->get('eventSorter')->getBeginDate($event)->format('d'),
        ];

        foreach ($eventUrlConstruct as $key => $fn) {
            $url = str_replace($key, $fn($event), $url);
        }
        $url = explode('/', $url);

        return $url;
    }

    public function getUrlBreadCrumb(Event $event): array
    {
        $eventFormats = $this->mf->get('parameter')->getCoreParameter('event_url_format');
        $eventFormats = explode('/', $eventFormats);

        $breadcrumbs = [];

        foreach ($eventFormats as $key => $eventFormat) {
            switch ($eventFormat) {
                case '%id%':
                    $breadcrumbs[$event->getName()] = $this->sf->get('urlService')->tfPath($event);
                    break;

                case '%slug%':
                    $breadcrumbs[$event->getName()] = $this->sf->get('urlService')->tfPath($event);
                    break;

                case '%category%':
                    if (null !== $event->getMainCategory()) {
                        $breadcrumbs[$event->getMainCategory()->getName()] = $this->sf->get('urlService')->tfPath($event->getMainCategory());
                    }
                    break;

                case '%season%':
                    if (null !== $event->getSeason()) {
                        $breadcrumbs[$event->getSeason()->getName()] = $this->sf->get('urlService')->tfPath($event->getSeason());
                    }
                    break;

                case '%room%':
                    if (null !== $event->getRoom()) {
                        $breadcrumbs[$event->getRoom()->getName()] = $this->sf->get('urlService')->tfPath($event->getRoom());
                    }
                    break;

                default; // Static strings
                    $breadcrumbs[$eventFormat] = null;
                    break;
            }
        }

        $breadcrumbs = array_reverse($breadcrumbs, true);


        return $breadcrumbs;
    }

    public function getEventDatesStr($event, $format = null): string
    {
        if ($format == null) {
            $format = $this->tr->trans('global.datetime-format');
        }

        $datesNb = $event->getEventDates()->count();

        switch ($datesNb) {
            case 0:
                return '';

            case 1:
                return $this->mf->get('eventDate')->getFormattedEventDatesStr($event, $this->mf->get('parameter')->getCoreTranslatedParameter("event_one_date_format", $this->getLocale()));

            case 2:
                return $this->mf->get('eventDate')->getFormattedEventDatesStr($event, $this->mf->get('parameter')->getCoreTranslatedParameter("event_two_date_format", $this->getLocale()));

            default:
                return $this->mf->get('eventDate')->getFormattedEventDatesStr($event, $this->mf->get('parameter')->getCoreTranslatedParameter("event_many_date_format", $this->getLocale()));
        }
    }

    public function getEventPricesStr(Event $event): string
    {
        $eventPrice = $this->em->getRepository(EventPrice::class)->findSmallestPriceForWebsite($event->getId());
        if (null === $eventPrice) {
            return "";
        }

        return $eventPrice->getPrice();
    }

    public function getMediasFromEvent($event): array
    {
        $medias = [];
        foreach (MimeTypeMapping::getAllCategories() as $type) {
            $type = iconv("utf-8", "ascii//TRANSLIT", $type);
            $type = strtolower($type);

            $medias[$type] = [];
        }

        $eventMedias = $event->getEventMedias()->toArray();
        usort($eventMedias, function ($a, $b) {
            if ($a->getPosition() == $b->getPosition()) {
                return 0;
            }

            if ($a->getPosition() > $b->getPosition()) {
                return 1;
            }

            return -1;
        });

        foreach ($eventMedias as $eventMedia) {
            $media = $eventMedia->getMedia();

            $type = MimeTypeMapping::getTypeFromMime($media->getDocumentType());
            $type = iconv("utf-8", "ascii//TRANSLIT", $type);
            $type = strtolower($type);

            $medias[$type][] = $media;
        }

        return $medias;
    }

    public function getEventDatesFromEvent(Event $event): ?array
    {
        return $this->em->getRepository(EventDate::class)->findAllByEventForWebsite($event->getId());
    }

    public function getEventPriceCategoriesFromEvent(Event $event): ?array
    {
        return $this->em->getRepository(EventPriceCategory::class)->findEventPriceCategoriesForWebsite($event->getId());
    }

    public function getFirstFormattedMedia($eventMedias, string $slug): ?EventMedia
    {
        $mediaManager = $this->mf->get('media');
        $imageFormat = $this->em->getRepository(ImageFormat::class)->findOneBySlugForWebsite($slug);

        if (null === $imageFormat) {
            return null;
        }

        foreach ($eventMedias as $eventMedia) {
            $mediaUrl = $mediaManager->getFormattedImageUrlFromFormat($eventMedia->getMedia(), $imageFormat);
            if (null !== $mediaUrl) {
                $eventMedia->getMedia()->setDocumentUrl($mediaUrl);
                return $eventMedia;
            }
        }

        return null;
    }

    public function getAllFormattedMedias($eventMedias, ?string $slug): array
    {
        if (null === $slug) {
            $formatedMedias = [];

            foreach ($eventMedias as $eventMedia) {
                if (count($eventMedia->getMedia()->getImageFormats()) === 0) {
                    $formatedMedias[] = $eventMedia;
                }
            }

            return $formatedMedias;
        }

        $mediaManager = $this->mf->get('media');
        $imageFormat = $this->em->getRepository(ImageFormat::class)->findOneBySlugForWebsite($slug);
        $formatedMedias = [];

        if (null === $imageFormat) {
            return [];
        }

        foreach ($eventMedias as $eventMedia) {
            $mediaUrl = $mediaManager->getFormattedImageUrlFromFormat($eventMedia->getMedia(), $imageFormat);
            if (null !== $mediaUrl) {
                $eventMedia->getMedia()->setDocumentUrl($mediaUrl);
                $formatedMedias[] = $eventMedia;
            }
        }

        return $formatedMedias;
    }

    public function getFilterParams(array $contents)
    {
        return [
            'beginDateFilter'        => $this->mf->get("parameter")->getCoreParameter('event_begin_date_filter'),
            'endDateFilter'          => $this->mf->get("parameter")->getCoreParameter('event_end_date_filter'),
            'seasonFilter'           => isset($contents['Season']) ? false : $this->mf->get("parameter")->getCoreParameter('event_season_filter'),
            'roomFilter'             => isset($contents['Room']) ? false : $this->mf->get("parameter")->getCoreParameter('event_room_filter'),
            'eventCategoryFilter'    => $this->mf->get("parameter")->getCoreParameter('event_category_filter'),
            'tagFilter'              => isset($contents['Tag']) ? false : $this->mf->get("parameter")->getCoreParameter('event_tag_filter'),
            'eventTypeFilter'        => isset($contents['EventType']) ? false : $this->mf->get("parameter")->getCoreParameter('event_type_filter')
        ];
    }

    public function formatEvent(Event $event): Event
    {
        $event->frontBookingButton = $this->getDisplayBookingButton($event);

        return $event;
    }

    public function getDisplayBookingButton(Event $event): bool
    {
        if (!$event->isDisplayBookingButton()) {
            return false;
        }

        if (null === $event->getTicketingReference()) {
            return false;
        }

        if (null === $event->getTicketing() || !$event->getTicketing()->isActive()) {
            return false;
        }

        $now = new \Datetime();
        if ($now > $this->mf->get('eventSorter')->getEndDate($event)) {
            return false;
        }

        return true;
    }

    public function getEventIframeLink(Event $event): ?string
    {
        if (!$this->getDisplayBookingButton($event)) {
            return null;
        }

        $ticketing = $event->getTicketing();
        $module = $ticketing->getModule();

        if (null !== $module) {
            $class = $this->sf->get('ticketing')->getTicketingClass($module) ?? $this->mf->get('ticketing');
            if (method_exists($class, "getEventIframeLink")) {
                return $class->getEventIframeLink($event);
            }
        } else {
            return $this->mf->get('ticketing')->getEventIframeLink($event);
        }

        return null;
    }

    public function getEventExternalLink(Event $event): ?string
    {
        if (!$this->getDisplayBookingButton($event)) {
            return null;
        }

        $ticketing = $event->getTicketing();
        $module = $ticketing->getModule();

        if (null !== $module) {
            $class = $this->sf->get('ticketing')->getTicketingClass($module) ?? $this->mf->get('ticketing');
            if (method_exists($class, "getEventExternalLink")) {
                return $class->getEventExternalLink($event);
            }
        } else {
            return $this->mf->get('ticketing')->getEventExternalLink($event);
        }

        return null;
    }

    public function getCalendarData(?string $slug, Event $event, array $eventDates): mixed
    {
        if (null === $slug) {
            $slug = (new \DateTime())->format('y-m');
        }

        $firstDayOfMonth = new \DateTime($slug . '-01');
        [$beginDate, $endDate] = $this->getPeriodDates($firstDayOfMonth);
        [$prevLink, $nextLink] = $this->generateLinks($firstDayOfMonth, $event->getId());

        $dates = $this->getEventArray($beginDate, $endDate, $eventDates);
        return [$firstDayOfMonth, $beginDate, $endDate, $prevLink, $nextLink, $dates];
    }

    public function getMaxPage(int $total, ?int $limit): ?int
    {
        if (null === $limit) {
            return null;
        }

        $maxPage = $total / $limit;

        if (($total % $limit) > 0) {
            $maxPage += 1;
        }

        return $maxPage;
    }

    public function getDefaultParameters($filters): array
    {
        [$sortField, $sortOrder] = self::WEBSITE_SORTS['chronoDesc'];
        if (isset($filters['sort']) && isset(self::WEBSITE_SORTS[$filters['sort']])) {
            [$sortField, $sortOrder] = self::WEBSITE_SORTS[$filters['sort']];
        }

        return array_values([
            "sortField" => $sortField,
            "sortOrder" => $sortOrder
        ]);
    }

    private function getPeriodDates(\DateTime $firstDayOfMonth): array
    {
        $beginDate = clone $firstDayOfMonth;
        $period = new \DateInterval('P' . ($beginDate->format('N') - 1) . 'D');
        $beginDate->sub($period);

        $endDate = clone $firstDayOfMonth;
        $period = new \DateInterval('P' . ($firstDayOfMonth->format('t') - 1) . 'D');
        $endDate->add($period);
        $period = new \DateInterval('P' . (7 - $endDate->format('N')) . 'D');
        $endDate->add($period);

        return [$beginDate, $endDate];
    }

    private function generateLinks(\DateTime $firstDayOfMonth, $eventId): array
    {
        $prevLink = clone $firstDayOfMonth;
        $prevLink->sub(new \DateInterval('P1M'));
        $prevLink = $this->sf->get('urlService')->generateUrl('tf_website_event_calendar_dates', ['period' => $prevLink->format('y-m'), 'eventId' => $eventId]);

        $nextLink = clone $firstDayOfMonth;
        $nextLink->add(new \DateInterval('P1M'));
        $nextLink = $this->sf->get('urlService')->generateUrl('tf_website_event_calendar_dates', ['period' => $nextLink->format('y-m'), 'eventId' => $eventId]);

        return [$prevLink, $nextLink];
    }

    private function getEventArray(\DateTime $beginDate, \DateTime $endDate, array $eventDates): array
    {
        $datesTab = [];
        $currentDate = clone $beginDate;
        while ($currentDate <= $endDate) {
            $datesTab[$currentDate->format('Y-m-d')] = [];
            $currentDate->add(new \DateInterval('P1D'));
        }

        foreach ($eventDates as $date) {
            $currentDate = $date->getEventDate();

            if ($currentDate >= $beginDate && $currentDate <= $endDate) {
                $datesTab[$currentDate->format('Y-m-d')][] = $date;
            }

            $reportDate = $date->getReportDate();
            if ($date->getState() == 'delayed' && null !== $reportDate && $reportDate >= $beginDate && $reportDate <= $endDate) {
                $delayedDate = clone $date;
                $delayedDate->setState('valid');
                $delayedDate->setEventDate($delayedDate->getReportDate());
                $delayedDate->setReportDate(null);

                $currentDate = $delayedDate->getEventDate();
                if ($beginDate <= $currentDate && $currentDate <= $endDate) {
                    $datesTab[$currentDate->format('Y-m-d')][] = $delayedDate;
                }
            }
        }

        return $datesTab;
    }
}
