<?php

namespace App\Controller\Website;

use App\Entity\Article\Article;
use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Event\Season;
use App\Entity\Event\Tag;
use App\Entity\Language\Language;
use App\Entity\Media\Media;
use App\Entity\Media\MediaCategory;

use Doctrine\Common\Util\ClassUtils;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends WebsiteController
{
    public function generateHeader(): Response
    {
        $route = $this->rs->getMainRequest()->get('_route');
        $menus = $this->mf->get('menuEntry')->getAllMenus();

        return $this->websiteRender('_partials/header.html.twig', [
            'locale' => $this->getLocale(),
            'menus'  => $menus,
        ]);
    }

    public function generateBreadcrumb($element, ?Season $season): Response
    {
        $breadcrumbs = [];

        if (null !== $element) {
            switch (ClassUtils::getClass($element)) {
                case Event::class:
                    if ($element->getSeason()->getId() != $currentSeason->getId()) {
                        $seasonBack = $currentSeason;
                    }

                    $breadcrumbs[$element->getShortTitle()] = '';
                    $breadcrumbs[$element->getMainCategory()->getName()] = $this->ps->orchestratorPath($element->getMainCategory(), ['season' => $season]);
                    $breadcrumbs[$element->getSeason()->getName()] = $this->ps->orchestratorPath($element->getSeason());
                    break;

                case EventCategory::class:
                    if ($season->getId() != $currentSeason->getId()) {
                        $seasonBack = $currentSeason;
                    }

                    $breadcrumbs[$element->getName()] = '';
                    $breadcrumbs[$season->getName()] = $this->ps->orchestratorPath($season);
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
                        $breadcrumbs[$element->getTitle()] = $this->ps->orchestratorPath($element);
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

    public function renderTradUrl($element, $season = null) {
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

            $url = $this->ps->orchestratorPath($newElement, $params);
        }

        $this->em->clear();

        return new Response($url);
    }

    public function generateFooter()
    {
        $footerMenus = $this->mf->get('menuEntry')->getOneMenu('Footer');

        $menus = [];
        if (isset($footerMenus['__children'])) {
            $menus = $footerMenus['__children'];
        }
        return $this->websiteRender('_partials/footer.html.twig', [
            'menus'  => $menus
        ]);
    }
}
