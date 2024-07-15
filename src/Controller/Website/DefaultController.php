<?php

namespace App\Controller\Website;

use App\Entity\Language\Language;
use App\Entity\Page\Page;
use Doctrine\Common\Util\ClassUtils;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends WebsiteController
{
    public function generateHeader(?Page $page, array $headerParameters = []): Response
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
            'route'            => $route,
            'locale'           => $this->getLocale(),
            'menus'            => $menus,
            'page'             => $page,
            'homePage'         => $homePage,
            'headerParameters' => $headerParameters,
        ]);
    }

    public function renderTradUrl($element, array $params = [])
    {
        $this->em->clear();

        if (null === $element || !method_exists($element, 'getLanguageGroup') || !isset($params['_locale'])) {
            return new Response('');
        }

        $newLanguage = $this->em->getRepository(Language::class)->findByLocaleForWebsite($params['_locale']);
        if (null === $newLanguage) {
            return new Response('');
        }

        $className = ClassUtils::getClass($element);
        $newElement = $this->em->getRepository($className)->findTranslationForWebsite($newLanguage->getId(), $element->getLanguageGroup());
        if (null === $newElement) {
            $url = '';
        } else {
            if (isset($params['keywordUrl']) && $params['keywordUrl'] !== "") {
                $newParams = [];

                foreach ($params as $key => $param) {
                    if (is_object($param) && method_exists($param, 'getLanguageGroup')) {
                        $newParamClassName = ClassUtils::getClass($param);
                        $newParam = $this->em->getRepository($newParamClassName)->findTranslationForWebsite($newLanguage->getId(), $param->getLanguageGroup());
                        if (null !== $newParam) {
                            $newParams[$key] = $newParam;
                        }
                    } else {
                        $newParams[$key] = $param;
                    }
                }

                $entityClassName = explode('\\', $className);
                $entityClassName = array_pop($entityClassName);

                $newParams[lcfirst($entityClassName)] = $newElement;
                $keywordUrl = $newParams['keywordUrl'];
                unset($newParams['keywordUrl']);

                $url = $this->sf->get('urlService')->keywordElementPath($keywordUrl, $newParams);
            } else {
                $url = $this->sf->get('urlService')->tfPath($newElement, $params);
            }
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
