<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Entity\Event\EventDateBlock;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventMedia;
use App\Entity\Event\EventPrice;
use App\Entity\Media\ImageFormat;

use App\Kernel;
use App\Service\Formatter\DateTimeFormatter;
use App\Service\ServiceFactory;
use App\Service\File\MimeTypeMapping;
use App\Service\Sort\EventSorter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class EventManager extends AbstractManager
{
    public const SERVICE_NAME = 'event';
    private const UNIQ_EVENT_IDENTIFIER = ['id', 'slug'];
    private const WEBSITE_SORTS = [
        'nameAsc' => ['name', 'ASC'],
        'nameDesc' => ['name', 'DESC'],
        'chronoAsc' => ['beginDate', 'ASC'],
        'chronoDesc' => ['beginDate', 'DESC'],
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

    public function getEventFromUrl(array $slugs): ?Event
    {
        $urlFormat = $this->mf->get('parameter')->getCoreParameter('event_url_format');

        $regexPattern = preg_replace('/%([^%]+)%/', '(?P<$1>[^/]+)', $urlFormat);
        $regexPattern = '#^' . $regexPattern . '$#';
        $url = implode('/', $slugs);

        if (!preg_match($regexPattern, $url, $matches)) {
            return null;
        }

        $index = null;
        $formatValue = null;
        foreach (self::UNIQ_EVENT_IDENTIFIER as $eventIdentifier) {
            if (isset($matches[$eventIdentifier])) {
                $index = $eventIdentifier;
                $formatValue = $matches[$eventIdentifier];
                break;
            }
        }

        if (null === $index) {
            return null;
        }

        $event = $this->getEventFromFormat($formatValue, $eventIdentifier);
        if (null === $event) {
            return null;
        }

        foreach ($matches as $key => $value) {
            switch ($key) {
                case 'category':
                    if (null == $event->getMainCategory() || $event->getMainCategory()->getSlug() !== $value) {
                        return null;
                    }
                    break;

                case 'season':
                    if (null == $event->getSeason() || $event->getSeason()->getSlug() !== $value) {
                        return null;
                    }
                    break;

                case 'room':
                    if (null == $event->getRoom() || $event->getRoom()->getSlug() !== $value) {
                        return null;
                    }
                    break;

                case 'year':
                    if ($event->getBeginDate()->format('Y') !== $value) {
                        return null;
                    }
                    break;

                case 'month':
                    if ($event->getBeginDate()->format('m') !== $value) {
                        return null;
                    }
                    break;

                case 'day':
                    if ($event->getBeginDate()->format('d') !== $value) {
                        return null;
                    }
                    break;

                case 'id':
                case 'slug':
                default:
                    break;
            }
        }

        return $this->formatEvent($event);
    }

    public function getEventFromFormat($formatValue, $format): ?Event
    {
        $languageId = $this->getLanguageId();

        switch ($format) {
            case 'id':
                return $this->em->getRepository(Event::class)->findByIdForWebsite($languageId, $formatValue);
                break;
            case 'slug':
                return $this->em->getRepository(Event::class)->findBySlugForWebsite($languageId, $formatValue);
                break;
            default:
                break;
        }

        return null;
    }

    public function getEventPricesReservationDefault(Event $event): array
    {
        $defaultPrices = [];
        $eventPrices = $this->em->getRepository(EventPrice::class)->findAllByEventForWebsite($event->getId());

        foreach ($eventPrices as $eventPrice) {
            $defaultPrices[] = [
                "eventPrice" => $eventPrice,
                "quantity"   => 0,
            ];
        }
        return $defaultPrices;
    }

    public function getEvents(array $filters): array
    {
        $events = $this->em->getRepository(Event::class)->findAllForWebsite($this->getLanguageId(), $filters);

        // Dates
        foreach ($events as &$event) {
            $eventDateBlocks = $this->em->getRepository(EventDateBlock::class)->findEventDateBlocksForWebsite($event->getId());
            foreach ($eventDateBlocks as $eventDateBlock) {
                $event->addEventDateBlock($eventDateBlock);
            }

            $event->frontBookingButton = $this->getDisplayBookingButton($event);
        }

        return $events;
    }

    public function getSortedEvents(array $filters): array
    {
        [$sortField, $sortOrder] = $this->getDefaultParameters($filters);

        $events = $this->getEvents($filters);

        return EventSorter::sortEvents($events, true, $sortField, $sortOrder);
    }

    public function getUrlSlugs(Event $event): array
    {
        $url = $this->mf->get('parameter')->getCoreParameter('event_url_format');
        $eventUrlConstruct = [
            '%id%' => fn ($event) => $event->getId(),
            '%slug%' => fn ($event) => $event->getSlug(),
            '%category%' => fn ($event) => $event->getMainCategory() ? $event->getMainCategory()->getSlug() : '',
            '%season%' => fn ($event) => $event->getSeason() ? $event->getSeason()->getSlug() : '',
            '%room%' => fn ($event) => $event->getRoom() ? $event->getRoom()->getSlug() : '',
            '%year%' => fn ($event) => $event->getBeginDate()->format('Y'),
            '%month%' => fn ($event) => $event->getBeginDate()->format('m'),
            '%day%' => fn ($event) => $event->getBeginDate()->format('d'),
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

        $datesNb = 0;
        foreach ($event->getEventDateBlocks() as $dateBlock) {
            foreach ($dateBlock->getEventDates() as $eventDate) {
                $datesNb++;
            }
        }

        switch ($datesNb) {
            case 0:
                return '';

            case 1:
                return (DateTimeFormatter::formatDate($event->getBeginDate(), $this->getLocale(), $format));

            case 2:
                return (DateTimeFormatter::formatDate($event->getBeginDate(), $this->getLocale(), $format) . ' ' .
                    $this->tr->trans('global.and') . ' ' .
                    DateTimeFormatter::formatDate($event->getEndDate(), $this->getLocale(), $format)
                );

            default:
                return (DateTimeFormatter::formatDate($event->getBeginDate(), $this->getLocale(), $format) . ' ' .
                    $this->tr->trans('global.to') . ' ' .
                    DateTimeFormatter::formatDate($event->getEndDate(), $this->getLocale(), $format)
                );
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
        $eventDates = $this->em->getRepository(EventDate::class)->findAllByEventForWebsite($event->getId());

        return $eventDates;
    }

    public function getEventPricesFromEvent(Event $event): ?array
    {
        $eventPrices = $this->em->getRepository(EventPrice::class)->findAllByEventForWebsite($event->getId());

        return $eventPrices;
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

    public function getFilterParams()
    {
        return [
            'beginDateFilter'   => $this->mf->get("parameter")->getCoreParameter('event_begin_date_filter'),
            'endDateFilter'     => $this->mf->get("parameter")->getCoreParameter('event_end_date_filter'),
            'seasonFilter'      => $this->mf->get("parameter")->getCoreParameter('event_season_filter'),
            'roomFilter'        => $this->mf->get("parameter")->getCoreParameter('event_room_filter'),
            'categoryFilter'    => $this->mf->get("parameter")->getCoreParameter('event_category_filter')
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
        if ($now > $event->getEndDate()) {
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
        }

        return null;
    }

    private function getDefaultParameters($filters): array
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

}
