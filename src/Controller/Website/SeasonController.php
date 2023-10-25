<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Event\Season;
use App\Form\Website\Event\EventFilterType;
use App\Service\Sort\EventSorter;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SeasonController extends WebsiteController
{
    public function index(Page $page, Season $season)
    {
        if ($this->getLanguageId() != $this->getDefaultLanguageId()) {
            $this->em->clear();

            $season = $this->em->getRepository(Season::class)->findTranslationForWebsite($this->getDefaultLanguageId(), $season->getLanguageGroup());

            return new RedirectResponse($this->sf->get('urlService')->tfPath($season, ['_locale' => $this->getDefaultLocale()]), 302);
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
            'month'    => $request->get('m'),
            'category' => $request->get('c'),
            'room'     => $request->get('r'),
            'sort'     => $request->get('s')
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

        $seasonPage = $this->mf->get("page")->getByKeyword("seasons");
        $seasonPageContents = [];
        if (null !== $seasonPage) {
            foreach ($seasonPage->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $seasonPageContents[$key] = $field;
                }
            }
        }

        $filters['season'] = $season->getId();
        $events = $this->mf->get('event')->getSortedEvents($filters);

        $template = 'Season/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'index.html.twig';

        return $this->websiteRender($template, [
            'page'               => $page,
            'season'             => $season,
            'activeEvents'       => $events['active'],
            'inactiveEvents'     => $events['inactive'],
            'seasonPage'         => $seasonPage,
            'seasonPageContents' => $seasonPageContents,
            'filterForm'         => $filterForm->createView()
        ]);
    }
}
