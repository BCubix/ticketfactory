<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\User\User;
use App\Entity\Event\Event;
use App\Form\Website\Event\EventReservationType;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session;

class EventController extends WebsiteController
{
    public function index(Event $event)
    {
        $userAddress = $this->getRequest()->get('u');
        $userPass = $this->getRequest()->get('t');
        $user = null;

        if (null  !== $userAddress && null !== $userPass) {
            $user = $this->em->getRepository(User::class)->getUserByTokenForWebsite($userAddress, $userPass);
        }

        if (null === $event || (false === $event->isActive() && (null === $user || !in_array("ROLE_ADMIN", $user->getRoles())))) {
            throw $this->createNotFoundException('This event does not exist.');
        }

        $eventReservationForm = $this->createForm(EventReservationType::class, null, ['eventId' => $event->getId()]);
        $eventReservationForm->handleRequest($this->getRequest());
        if ($eventReservationForm->isSubmitted() && $eventReservationForm->isValid()) {
            $formData = $eventReservationForm->getData();
            $formData["event"] = $event->getId();
            $formData["eventDate"] = $formData["eventDate"]->getId();
            $formData["eventPrice"] = $formData["eventPrice"]->getId();
            $this->mf->get("cart")->addEventToCart($formData);

            return new Response(null, 200);
        }

        $medias = $this->mf->get('event')->getMediasFromEvent($event);
        $eventDates = $this->mf->get('event')->getEventDatesFromEvent($event);
        $eventPrices = $this->mf->get('event')->getEventPricesFromEvent($event);

        return $this->websiteRender('Event/detail.html.twig', [
            'event'                => $event,
            'medias'               => $medias,
            'eventReservationForm' => $eventReservationForm->createView(),
            'eventDates'           => $eventDates,
            'eventPrices'          => $eventPrices,
        ]);
    }
}

