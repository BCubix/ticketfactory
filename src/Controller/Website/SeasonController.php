<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Event\Season;
use App\Service\Sort\EventSorter;

use Symfony\Component\HttpFoundation\Request;

class SeasonController extends WebsiteController
{
    public function index(Page $page, Season $season)
    {
        if ($this->getLanguageId() != $this->getDefaultLanguageId()) {
            $this->em->clear();

            $season = $this->em->getRepository(Season::class)->findTranslationForWebsite($this->getDefaultLanguageId(), $season->getLanguageGroup());

            return new RedirectResponse($this->sf->get('urlService')->tfPath($season, ['_locale' => $this->getDefaultLocale()]), 302);
        }

        $events = $this->mf->get('event')->getEvents(['season' => $season->getId()]);
        $events = EventSorter::sortEvents($events, true);

        return $this->websiteRender('Season/index.html.twig', [
            'page' => $page,
            'season' => $season,
            'activeEvents' => $events['active'],
            'inactiveEvents' => $events['inactive']
        ]);
    }
}

