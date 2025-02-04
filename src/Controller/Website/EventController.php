<?php

namespace App\Controller\Website;

use App\Entity\Event\Event;
use App\Entity\Page\Page;
use App\Entity\Url\Url;
use App\Form\Website\Event\EventReservationType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EventController extends EventAbleController
{
    public function orchestrator(?Page $page, Url $url, string $slug)
    {
        $urlFormat = $url->getSlug();
        $attachedPage = $this->mf->get('event')->getAttachedPage($url);
        if (null !== $attachedPage) {
            $page = $attachedPage;

            $urlFormat = $this->mf->get('page')->getPageSlugPath($page) . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('event')->getObjectFromUrl($slug, $urlFormat, $activeFilter);

        if (null === $contents) {
            return new Response(null, 404);
        }

        $breadCrumbs = $this->mf->get('event')->generateBreadcrumbs($attachedPage, $url, $slug, $contents);

        if (isset($contents['Event'])) {
            return $this->index($contents['Event'], $breadCrumbs);
        }

        $template = 'Event/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $breadCrumbs, $template);
    }

    public function list(Page $page)
    {
        $template = 'Event/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        return $this->renderListPage($page, [], $breadcrumbs, $template);
    }

    public function index(Event $event, ?array $breadcrumbs)
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
        $eventPriceCategories = $this->mf->get('event')->getEventPriceCategoriesFromEvent($event);
        [$firstDayOfMonth, $beginDate, $endDate, $prevLink, $nextLink, $dates] = $this->mf->get('event')->getCalendarData(null, $event, $eventDates);

        $event = $this->mf->get('event')->formatEvent($event);

        return $this->websiteRender('Event/detail.html.twig', [
            'breadcrumbs'          => $breadcrumbs,
            'event'                => $event,
            'medias'               => $medias,
            'eventReservationForm' => $eventReservationForm->createView(),
            'eventDates'      => $eventDates,
            'eventPriceCategories'     => $eventPriceCategories,
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
            'eventDates'      => $eventDates,
            'firstDayOfMonth'      => $firstDayOfMonth,
            'beginDate'            => $beginDate,
            'endDate'              => $endDate,
            'prevLink'             => $prevLink,
            'nextLink'             => $nextLink,
            'dates'                => $dates,
        ]);
    }
}
