<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Entity\Event\EventDateBlock;
use App\Service\Formatter\DateTimeFormatter;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class EventManager extends AbstractManager
{
    public const SERVICE_NAME = 'event';

    protected $tr;

    public function __construct(ManagerFactory $mf, ServiceFactory $sf, EntityManagerInterface $em, RequestStack $rs, TranslatorInterface $tr)
    {
        parent::__construct($mf, $sf, $em, $rs);

        $this->tr = $tr;
    }

    public function getFromUrl(array $slugs): ?Event
    {
        $eventFormat = $this->mf->get('parameter')->get('event_url_format');
        $eventFormats = explode('/', $eventFormat);

        $languageId = $this->getLanguageId();
        $event = null;

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

    public function getUrlSlugs(Event $event): array
    {
        $eventFormats = $this->mf->get('parameter')->get('event_url_format');
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
                    $url[] = $event->getMainCategory();
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
                return (
                    DateTimeFormatter::formatDate($event->getBeginDate(), $this->getLocale(), $format) . ' ' .
                    $this->tr->trans('global.and') . ' ' .
                    DateTimeFormatter::formatDate($event->getEndDate(), $this->getLocale(), $format)
                );

            default:
                return (
                    DateTimeFormatter::formatDate($event->getBeginDate(), $this->getLocale(), $format) . ' ' .
                    $this->tr->trans('global.to') . ' ' .
                    DateTimeFormatter::formatDate($event->getEndDate(), $this->getLocale(), $format)
                );
        }
    }
}
