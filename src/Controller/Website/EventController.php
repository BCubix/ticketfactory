<?php

namespace App\Controller\Website;

use App\Entity\User\User;
use App\Entity\Event\Event;
use App\Form\Website\Event\EventReservationType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EventController extends WebsiteController
{
    public function orchestrator(string $slug, string $urlFormat)
    {
        $userAddress = $this->getRequest()->get('u');
        $userPass = $this->getRequest()->get('t');
        $user = null;

        if (null  !== $userAddress && null !== $userPass) {
            $user = $this->em->getRepository(User::class)->getUserByTokenForWebsite($userAddress, $userPass);
        }

        $activeFilter = true;
        if (null !== $user && in_array("ROLE_ADMIN", $user->getRoles())) {
            $activeFilter = false;
        }

        $result = $this->mf->get('event')->getEventFromUrl($slug, $urlFormat, $activeFilter);

        if (null === $result) {
            return new Response(null, 404);
        }

        return $this->index($result['Event']);
    }

    public function index(Event $event)
    {
        $eventReservationForm = $this->createForm(EventReservationType::class, null, ['eventId' => $event->getId()]);
        $eventReservationForm->get('eventPrices')->setData($this->mf->get("event")->getEventPricesReservationDefault($event));
        $eventReservationForm->handleRequest($this->getRequest());
        if ($eventReservationForm->isSubmitted() && $eventReservationForm->isValid()) {
            $formData = $eventReservationForm->getData();

            $this->mf->get("cart")->addEventToCart($event, $formData);

            return $this->websiteRender("_partials/_notification.html.twig", [
                'title' => 'Succès',
                'message' => "Votre article à été ajouté au panier."
            ]);
        }

        $medias = $this->mf->get('event')->getMediasFromEvent($event);
        $eventDates = $this->mf->get('event')->getEventDatesFromEvent($event);
        $eventPrices = $this->mf->get('event')->getEventPricesFromEvent($event);
        [$firstDayOfMonth, $beginDate, $endDate, $prevLink, $nextLink, $dates] = $this->mf->get('event')->getCalendarData(null, $event, $eventDates);

        return $this->websiteRender('Event/detail.html.twig', [
            'event'                => $event,
            'medias'               => $medias,
            'eventReservationForm' => $eventReservationForm->createView(),
            'eventDates'           => $eventDates,
            'eventPrices'          => $eventPrices,
            'firstDayOfMonth'      => $firstDayOfMonth,
            'beginDate'            => $beginDate,
            'endDate'              => $endDate,
            'prevLink'             => $prevLink,
            'nextLink'             => $nextLink,
            'dates'                => $dates,
        ]);
    }

    #[Route('/event/calendar-dates', name: 'tf_website_event_calendar_dates', priority: 1)]
    public function calendarDates(Request $request)
    {
        $period = $request->get('period');
        $eventId = $request->get('eventId');

        if (null === $eventId) {
            throw $this->createNotFoundException('eventId not found.');
        }

        $event = $this->em->getRepository(Event::class)->findOneByIdForWebsite($eventId);
        if (null === $event) {
            throw $this->createNotFoundException('This event does not exist.');
        }

        $eventDates = $this->mf->get('event')->getEventDatesFromEvent($event);
        [$firstDayOfMonth, $beginDate, $endDate, $prevLink, $nextLink, $dates] = $this->mf->get('event')->getCalendarData($period, $event, $eventDates);


        return $this->websiteRender('Event/_eventCalendar.html.twig', [
            'event'                => $event,
            'eventDates'           => $eventDates,
            'firstDayOfMonth'      => $firstDayOfMonth,
            'beginDate'            => $beginDate,
            'endDate'              => $endDate,
            'prevLink'             => $prevLink,
            'nextLink'             => $nextLink,
            'dates'                => $dates,
        ]);
    }
}
