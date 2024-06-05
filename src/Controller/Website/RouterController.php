<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Url\Url;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RouterController extends WebsiteController
{
    #[Route('/{slugs}', name: 'tf_website_global', requirements: ['slugs' => '^(?!/en).*$'], priority: -10)]
    public function orchestrator(string $slugs): Response
    {
        // We explode url to get path as slug tokens
        $slug = $slugs;
        $slugs = explode('/', $slugs);
        array_filter($slugs, function ($value) {
            return !empty($value);
        });

        // If url ends with trailing slash, we redirect to the same url without it
        if (count($slugs) > 1 && empty($slugs[count($slugs) - 1])) {
            array_pop($slugs);
            $slugs = implode('/', $slugs);
            $params = array_merge(['slugs' => $slugs], $this->getRequest()->query->all());

            return $this->redirectToRoute('tf_website_global', $params);
        }

        // We continue to go down slugs hierarchy as long as they match pages
        $mainPage = $this->sf->get('urlService')->getMainPageBySlugArray($slugs);

        $urlList = $this->em->getRepository(Url::class)->findAllForWebsite();
        foreach ($urlList as $url) {
            $response = $this->forward($url->getController(), [
                'page' => $mainPage,
                'slug' => $slug,
                'urlFormat' => $url->getSlug()
            ]);

            if ($response->getStatusCode() !== 404) {
                return $response;
            }
        }

        // We check for page mapping
        $page = $this->mf->get('page')->getPageBySlugArray($slugs);
        if (null === $page) {
            throw $this->createNotFoundException('Cette page n\'existe pas.');
        }

        return $this->forwardPages($mainPage, $slugs);
    }

    private function forwardPages(?Page $page, array $slugs): ?Response
    {
        if (null !== $page->getController()) {
            return $this->forward($page->getController(), [
                'page' => $page,
                'slugs' => $slugs
            ]);
        }

        return $this->forward('App\Controller\Website\PageController::index', [
            'page' => $page,
            'slugs' => $slugs
        ]);
    }
}
