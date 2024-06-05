<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Event\Tag;
use Symfony\Component\HttpFoundation\Response;

class TagController extends EventAbleController
{
    public function orchestrator(?Page $page, string $slug, string $urlFormat)
    {
        $parameterPage = $this->mf->get('parameter')->getCoreParameter('page_tag');
        if (null !== $parameterPage) {
            $page = $parameterPage;

            $urlFormat = $page->getSlug() . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('tag')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        $template = 'Tag/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $template);
    }

    public function list(Page $page) {
        $request = $this->getRequest();

        $displayTags = $this->mf->get("parameter")->getCoreParameter("display_tags");
        if (!$displayTags) {
            throw $this->createNotFoundException('This page does not exist.');
        }

        $tags = $this->em->getRepository(Tag::class)->findAllForWebsite($this->getLanguageId());

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        $template = 'Tag/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'page'               => $page,
            'tags'               => $tags,
            'pageContent'        => $pageContent,
        ]);
    }
}
