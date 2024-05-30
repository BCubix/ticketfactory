<?php

namespace App\Controller\Website;

use App\Entity\Event\EventCategory;
use App\Entity\Event\EventType;
use App\Entity\Event\Room;
use App\Entity\Page\Page;
use App\Entity\Event\Season;
use App\Entity\Event\Tag;
use App\Entity\User\User;
use App\Form\Website\Event\EventFilterType;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

class SeasonController extends WebsiteController
{
    public function orchestrator(?Page $page, string $slug, string $urlFormat)
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

        $contents = $this->mf->get('season')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        return $this->index($page, $contents['Season'], $contents);
    }

    public function index(?Page $page, ?Season $season, ?array $contents)
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
            'room'      => $request->get('room') ??  null,
            'tag'       => $request->get('tag') ?? null,
            'type'      => $request->get('type') ?? null,
            'sort'      => $request->get('sort') ?? $this->mf->get('parameter')->getCoreParameter('event_default_sort'),
            'page'      => $request->get('page') ?? 1,
            'limit'     => $this->mf->get('parameter')->getCoreParameter('event_limit'),
        ];

        if (null !== $filters['category'] || isset($contents['EventCategory'])) {
            $filters['category'] = [$this->em->getRepository(EventCategory::class)->find($filters['category'] ?? $contents['EventCategory']->getId())];
        }

        if (null !== $filters['room'] || isset($contents['Room'])) {
            $filters['room'] = $this->em->getRepository(Room::class)->find($filters['room'] ?? $contents['Room']->getId());
        }

        if (null !== $filters['tag'] || isset($contents['Tag'])) {
            $filters['tag'] = $this->em->getRepository(Tag::class)->find($filters['tag'] ?? $contents['Tag']->getId());
        }

        if (null !== $filters['type'] || isset($contents['EventType'])) {
            $filters['type'] = $this->em->getRepository(EventType::class)->find($filters['type'] ?? $contents['EventType']->getId());
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
