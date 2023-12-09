<?php

namespace App\Controller\Website;

use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Entity\Page\Page;
use App\Entity\Event\Season;
use App\Form\Website\Event\EventFilterType;
use App\Service\Sort\EventSorter;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SeasonController extends WebsiteController
{
    public function index(Page $page, ?Season $season, array $slugs)
    {
        if ($this->getLanguageId() != $this->getDefaultLanguageId()) {
            $this->em->clear();

            if (null !== $season) {
                $season = $this->em->getRepository(Season::class)->findTranslationForWebsite($this->getDefaultLanguageId(), $season->getLanguageGroup());
                return new RedirectResponse($this->sf->get('urlService')->tfPath($season, ['_locale' => $this->getDefaultLocale()]), 302);
            }

            return new RedirectResponse($this->sf->get('urlService')->tfPath($page, ['_locale' => $this->getDefaultLocale()]), 302);
        }

        $request = $this->getRequest();

        $today = new \Datetime();
        $today->setTime(0, 0, 0);
        $months = EventSorter::getNextMonths($today);
        $sort = [
            'Nom (Ordre alphabétique)' => 'nameAsc',
            'Nom (Ordre anti-alphabétique)' => 'nameDesc',
            'Date (Ordre chronologique)' => 'chronoAsc',
            'Date (Ordre antéchronologique)' => 'chronoDesc',
        ];

        $filters = [
            'beginDate' => $request->get('beginDate') ?? null,
            'endDate'   => $request->get('endDate') ?? null,
            'category'  => $request->get('category') ?? null,
            'room'      => $request->get('room') ?? null,
            'month'     => $request->get('month') ?? null,
            'sort'      => $request->get('sort') ?? null
        ];

        if (null !== $filters['category']) {
            $filters['category'] = $this->em->getRepository(EventCategory::class)->find($filters['category']);
        }

        if (null !== $filters['room']) {
            $filters['room'] = $this->em->getRepository(Room::class)->find($filters['room']);
        }

        $filterForm = $this->createForm(EventFilterType::class, null, ['months' => $months, 'sort' => $sort]);
        $filterForm->setData($filters);
        $filterForm->handleRequest($request);

        if ($filterForm->isSubmitted() && $filterForm->isValid()) {
            $filters = $filterForm->getData();
        }

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        if (null !== $season) {
            $filters['season'] = $season->getId();
        }

        $events = $this->mf->get('event')->getSortedEvents($filters);

        $template = 'Season/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'index.html.twig';

        return $this->websiteRender($template, [
            'page'               => $page,
            'season'             => $season,
            'activeEvents'       => $events['active'],
            'inactiveEvents'     => $events['inactive'],
            'pageContent'        => $pageContent,
            'filterForm'         => $filterForm->createView()
        ]);
    }
}
