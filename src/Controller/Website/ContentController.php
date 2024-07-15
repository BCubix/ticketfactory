<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Url\Url;

use Symfony\Component\HttpFoundation\Response;

class ContentController extends EventAbleController
{
    public function orchestrator(?Page $page, Url $url, string $slug)
    {
        $urlFormat = $url->getSlug();
        $attachedPage = $this->mf->get('content')->getAttachedPage($url);
        if (null !== $attachedPage) {
            $page = $attachedPage;

            $urlFormat = $this->mf->get('page')->getPageSlugPath($page) . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('content')->getContentObjectFromUrl($url, $slug, $urlFormat, $activeFilter);
        if (null === $contents || !isset($contents['Content'])) {
            return new Response(null, 404);
        }

        $breadcrumbs = $this->mf->get('content')->generateBreadcrumbs($attachedPage, $url, $slug, $contents);

        return $this->detail($contents, $breadcrumbs);
    }

    public function list(Page $page) {
        $request = $this->getRequest();
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        $contentTypes = $page->getContentTypes();
        $contents = [];
        foreach($contentTypes as $contentType) {
            $contents = array_merge($contents, $this->mf->get('content')->getAllByTypeIdForWebsite($this->getLanguageId(), $contentType->getId()));
        }

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        $template = 'Content/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'contents'           => $contents,
            'pageContent'        => $pageContent,
        ]);
    }

    public function detail(array $contents, array $breadcrumbs)
    {
        $content = $contents['Content'];
        $page = $content->getContentType()->getPageParent();

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        return $this->websiteRender('Content/detail.html.twig', [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'content'            => $content,
            'pageContent'        => $pageContent,
        ]);
    }
}
