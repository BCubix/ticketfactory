<?php

namespace App\Controller\Website;

use App\Entity\Event\EventCategory;
use App\Entity\Event\Season;
use App\Entity\Language\Language;
use App\Entity\Page\Page;
use Doctrine\Common\Util\ClassUtils;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends WebsiteController
{
    public function generateHeader(?Page $page): Response
    {
        $menus = $this->mf->get('menuEntry')->getAllMenus();
        $route = $this->rs->getMainRequest()->get('_route');
        $slugs    = $this->rs->getMainRequest()->get('slugs');
        $homePage = ($slugs == "");

        if (null !== $page && $slugs == $page->getSlug()) {
            $homePage = ($page->getKeyword() == 'home');
        }

        if ($route !== "tf_website_global") {
            $homePage = false;
        }

        return $this->websiteRender('_partials/header.html.twig', [
            'route'   => $route,
            'locale'  => $this->getLocale(),
            'menus'   => $menus,
            'page'    => $page,
            'homePage' => $homePage,
        ]);
    }

    public function renderTradUrl($element, $season = null)
    {
        $currentLocale = $this->getLocale();
        $newLocale = ($currentLocale == 'fr' ? 'en' : 'fr');

        $params = [];
        $params['_locale'] = $newLocale;

        $this->em->clear();

        if (null === $element || !method_exists($element, 'getLanguageGroup')) {
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
