<?php

namespace App\Controller\Website;

use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Entity\Page\Page;
use App\Entity\Event\Season;
use App\Form\Website\Event\EventFilterType;
use Doctrine\Common\Collections\ArrayCollection;
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
            'sort'      => $request->get('sort') ?? $this->mf->get('parameter')->getCoreParameter('event_default_sort'),
            'page'      => $request->get('page') ?? 1,
            'limit'     => $this->mf->get('parameter')->getCoreParameter('event_limit'),
        ];

        if (null !== $filters['category']) {
            $filters['category'] = [$this->em->getRepository(EventCategory::class)->find($filters['category'])];
        }

        if (null !== $filters['room']) {
            $filters['room'] = $this->em->getRepository(Room::class)->find($filters['room']);
        }

        $filterParams = $this->mf->get("event")->getFilterParams();
        $filterForm = $this->createForm(EventFilterType::class, null, ['filterParams' => $filterParams, 'sort' => $sort]);
        $filterForm->setData($filters);
        $filterForm->handleRequest($request);

        if ($filterForm->isSubmitted() && $filterForm->isValid()) {
            $filters = $filterForm->getData();

            if (null !== $filters['category'] && get_class($filters['category']) !== ArrayCollection::class) {
                $filters['category'] = new ArrayCollection([$filters['category']]);
            }
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
            'filterForm'         => $filterForm->createView(),
            'filterParams'       => $filterParams,
            'pagination'         => [
                'page'               => $filters['page'],
                'limit'              => $filters['limit'],
                'activeTotal'        => $events['activeTotal'],
                'inactiveTotal'      => $events['inactiveTotal'],
                'activeMaxPage'      => $this->mf->get('event')->getMaxPage($events['activeTotal'], $filters['limit']),
                'inactiveMaxPage'    => $this->mf->get('event')->getMaxPage($events['inactiveTotal'], $filters['limit']),
            ]
        ]);
    }

    public function list(Page $page) {
        $request = $this->getRequest();

        $displaySeasons = $this->mf->get("parameter")->getCoreParameter("display_seasons");
        if (!$displaySeasons) {
            throw $this->createNotFoundException('This page does not exist.');
        }

        $seasons = $this->em->getRepository(Season::class)->findAllForWebsite($this->getLanguageId());
        
        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        $template = 'Season/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'page'               => $page,
            'seasons'            => $seasons,
            'pageContent'        => $pageContent,
        ]);
    }
}
