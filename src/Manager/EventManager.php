<?php

namespace App\Manager;

use App\Entity\Event\Event;

class EventManager extends AbstractManager
{
    public const SERVICE_NAME = 'event';

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
}
