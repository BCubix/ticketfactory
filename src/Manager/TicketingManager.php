<?php

namespace App\Manager;

use App\Entity\Event\Event;

class TicketingManager extends AbstractManager
{
    public const SERVICE_NAME = 'ticketing';

    public function getEventIframeLink(Event $event): ?string
    {
        $ticketing = $event->getTicketing();
        if (null === $ticketing) {
            return null;
        }

        $link = "";

        if (isset($ticketing->getData()['iframe']['link'])) {
            $link .= str_replace('%slug%', $event->getTicketingReference(), $ticketing->getData()['iframe']['link']);
        }

        return $link;
    }

    public function getEventExternalLink(Event $event): ?string
    {
        $ticketing = $event->getTicketing();
        if (null === $ticketing) {
            return null;
        }

        $link = "";

        if (isset($ticketing->getData()['external']['link'])) {
            $link .= str_replace('%slug%', $event->getTicketingReference(), $ticketing->getData()['external']['link']);
        }

        return $link;
    }
}
