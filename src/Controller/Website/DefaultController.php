<?php

namespace App\Controller\Website;

use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Event\Season;
use App\Entity\Event\Tag;
use App\Entity\Language\Language;

use Doctrine\Common\Util\ClassUtils;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends WebsiteController
{
    public function generateHeader(): Response
    {
        $route = $this->rs->getMainRequest()->get('_route');
        $menus = $this->mf->get('menuEntry')->getAllMenus();

        return $this->websiteRender('_partials/header.html.twig', [
            'locale'  => $this->getLocale(),
            'menus'   => $menus,
        ]);
    }

    public function generateBreadcrumb($element): Response
    {
        $currentSeason = $this->mf->get("season")->getCurrentSeason();
        $season = $currentSeason;
        $seasonBack = null;

        $breadcrumbs = [];

        if (null !== $element) {
            switch (ClassUtils::getClass($element)) {
                case Event::class:
                    if (null === $element->getSeason() || $element->getSeason()->getId() != $currentSeason->getId()) {
                        $seasonBack = $currentSeason;
                    }

                    $breadcrumbs[$element->getName()] = '';
                    $breadcrumbs[$element->getMainCategory()->getName()] = $this->sf->get('urlService')->tfPath($element->getMainCategory(), ['season' => $season]);
                    if (null !== $element->getSeason()) {
                        $breadcrumbs[$element->getSeason()->getName()] = $this->sf->get('urlService')->tfPath($element->getSeason());
                    }

                    break;

                case EventCategory::class:
                    if ($season->getId() != $currentSeason->getId()) {
                        $seasonBack = $currentSeason;
                    }

                    $breadcrumbs[$element->getName()] = '';
                    $breadcrumbs[$season->getName()] = $this->sf->get('urlService')->tfPath($season);
                    break;

                case Season::class:
                    if ($element->getId() != $currentSeason->getId()) {
                        $seasonBack = $currentSeason;
                    }

                    $breadcrumbs[$element->getName()] = '';
                    break;

                case Tag::class:
                    $breadcrumbs[$element->getTitle()] = '';
                    break;

                default:
                    $breadcrumbs[$element->getTitle()] = '';

                    while (null != $element->getParent()) {
                        $element = $element->getParent();
                        $breadcrumbs[$element->getTitle()] = $this->sf->get('urlService')->tfPath($element);
                    }
                    break;
            }
        }

        $breadcrumbs = array_reverse($breadcrumbs, true);

        return $this->websiteRender('_partials/breadcrumb.html.twig', [
            'seasonBack'  => $seasonBack,
            'breadcrumbs' => $breadcrumbs
        ]);
    }

    public function renderTradUrl($element, $season = null)
    {
        $currentLocale = $this->getLocale();
        $newLocale = ($currentLocale == 'fr' ? 'en' : 'fr');

        $params = [];
        $params['_locale'] = $newLocale;

        $this->em->clear();

        if (!method_exists($element, 'getLanguageGroup')) {
            return new Response('');
        }

        $className = ClassUtils::getClass($element);
        $newLanguage = $this->em->getRepository(Language::class)->findByLocaleForWebsite($newLocale);
        $newElement = $this->em->getRepository($className)->findTranslationForWebsite($newLanguage->getId(), $element->getLanguageGroup());

        if (null === $newElement) {
            $url = '';
        } else {
            if ($className == EventCategory::class) {
                $newSeason = $this->em->getRepository(Season::class)->findTranslationForWebsite($newLanguage->getId(), $season->getLanguageGroup());
                if (null !== $newSeason) {
                    $params['season'] = $newSeason;
                }
            }

            $url = $this->sf->get('urlService')->tfPath($newElement, $params);
        }

        $this->em->clear();

        return new Response($url);
    }

    public function generateFooter()
    {
        $menus = $this->mf->get('menuEntry')->getAllMenus();

        return $this->websiteRender('_partials/footer.html.twig', [
            'menus'  => $menus
        ]);
    }
}
