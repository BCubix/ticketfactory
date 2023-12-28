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

    protected $tr;

    private const WEBSITE_SORTS = [
        'nameAsc' => ['name', 'ASC'],
        'nameDesc' => ['name', 'DESC'],
        'chronoAsc' => ['beginDate', 'ASC'],
        'chronoDesc' => ['beginDate', 'DESC'],
    ];

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

    public function getFromUrl(array $slugs): ?Event
    {
        $eventFormat = $this->mf->get('parameter')->getCoreParameter('event_url_format');
        $eventFormats = explode('/', $eventFormat);

        $languageId = $this->getLanguageId();
        $event = null;

        if (count($eventFormats) > count($slugs)) {
            return null;
        }

        foreach ($eventFormats as $key => $eventFormat) {
            switch ($eventFormat) {
                case '%id%':
                    $event = $this->em->getRepository(Event::class)->findByIdForWebsite($languageId, $slugs[$key]);
                    break;

                case '%slug%':
                    $event = $this->em->getRepository(Event::class)->findBySlugForWebsite($languageId, $slugs[$key]);
                    break;

                default:
                    break;
            }
        }

        if (null == $event) {
            return null;
        }

        foreach ($eventFormats as $key => $eventFormat) {
            switch ($eventFormat) {
                case '%category%':
                    if (null == $event->getMainCategory() || $event->getMainCategory()->getSlug() !== $slugs[$key]) {
                        return null;
                    }
                    break;

                case '%season%':
                    if (null == $event->getSeason() || $event->getSeason()->getSlug() !== $slugs[$key]) {
                        return null;
                    }
                    break;

                case '%room%':
                    if (null == $event->getRoom() || $event->getRoom()->getSlug() !== $slugs[$key]) {
                        return null;
                    }
                    break;

                case '%year%':
                    if ($event->getBeginDate()->format('Y') !== $slugs[$key]) {
                        return null;
                    }
                    break;

                case '%month%':
                    if ($event->getBeginDate()->format('m') !== $slugs[$key]) {
                        return null;
                    }
                    break;

                case '%day%':
                    if ($event->getBeginDate()->format('d') !== $slugs[$key]) {
                        return null;
                    }
                    break;

                default; // Static strings
                    break;
            }
        }

        return $event;
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
        $eventFormats = $this->mf->get('parameter')->getCoreParameter('event_url_format');
        $eventFormats = explode('/', $eventFormats);

        $languageId = $this->getLanguageId();
        $url = [];

        foreach ($eventFormats as $key => $eventFormat) {
            switch ($eventFormat) {
                case '%id%':
                    $url[] = $event->getId();
                    break;

                case '%slug%':
                    $url[] = $event->getSlug();
                    break;

                case '%category%':
                    if (null !== $event->getMainCategory()) {
                        $url[] = $event->getMainCategory()->getSlug();
                    }
                    break;

                case '%season%':
                    if (null !== $event->getSeason()) {
                        $url[] = $event->getSeason()->getSlug();
                    }
                    break;

                case '%room%':
                    if (null !== $event->getRoom()) {
                        $url[] = $event->getRoom()->getSlug();
                    }
                    break;

                case '%year%':
                    $url[] = $event->getBeginDate()->format('Y');
                    break;

                case '%month%':
                    $url[] = $event->getBeginDate()->format('m');
                    break;

                case '%day%':
                    $url[] = $event->getBeginDate()->format('d');
                    break;

                default; // Static strings
                    $url[] = $eventFormat;
                    break;
            }
        }

        return $url;
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

    public function getAllFormattedMedias($eventMedias, string $slug): array
    {
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
