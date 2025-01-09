<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Event\Tag;
use App\Entity\Url\Url;
use Symfony\Component\HttpFoundation\Response;

class TagController extends EventAbleController
{
    public function orchestrator(?Page $page, Url $url, string $slug)
    {
        $urlFormat = $url->getSlug();
        $attachedPage = $this->mf->get('tag')->getAttachedPage($url);
        if (null !== $attachedPage) {
            $page = $attachedPage;

            $urlFormat = $this->mf->get('page')->getPageSlugPath($page) . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('tag')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        $breadcrumbs = $this->mf->get('tag')->generateBreadcrumbs($attachedPage, $url, $slug, $contents);
        $template = 'Tag/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $breadcrumbs, $template);
    }

    public function list(Page $page) {
        $request = $this->getRequest();
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        $displayTags = $this->mf->get("parameter")->getCoreParameter("display_tags");
        if (!$displayTags) {
            throw $this->createNotFoundException('This page does not exist.');
        }

        $tags = $this->em->getRepository(Tag::class)->findAllForWebsite($this->getLanguageId());

        $template = 'Tag/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'tags'               => $tags,
        ]);
    }
}
