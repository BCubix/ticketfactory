<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Event\Season;
use Symfony\Component\HttpFoundation\Response;

class SeasonController extends EventAbleController
{
    public function orchestrator(?Page $page, string $slug, string $urlFormat)
    {
        $parameterPage = $this->mf->get('parameter')->getCoreParameter('page_season');
        if (null !== $parameterPage) {
            $page = $parameterPage;

            $urlFormat = $page->getSlug() . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('season')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        $template = 'Season/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $template);
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
