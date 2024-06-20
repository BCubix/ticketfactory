<?php

namespace App\Controller\Website;

use App\Entity\Event\EventCategory;
use App\Entity\Page\Page;
use App\Entity\Url\Url;

use Symfony\Component\HttpFoundation\Response;

class EventCategoryController extends EventAbleController
{
    public function orchestrator(?Page $page, Url $url, string $slug)
    {
        $urlFormat = $url->getSlug();
        $attachedPage = $this->mf->get('eventCategory')->getAttachedPage($url);
        if (null !== $attachedPage) {
            $page = $attachedPage;

            $urlFormat = $this->mf->get('page')->getPageSlugPath($page) . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('eventCategory')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        $breadcrumbs = $this->mf->get('eventCategory')->generateBreadcrumbs($attachedPage, $url, $slug, $contents);
        $template = 'EventCategory/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $breadcrumbs, $template);
    }

    public function list(Page $page) {
        $request = $this->getRequest();
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        $eventCategories = $this->em->getRepository(EventCategory::class)->getTopCategoriesForWebsite($this->getLanguageId());

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        $template = 'EventCategory/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'eventCategories'    => $eventCategories,
            'pageContent'        => $pageContent,
        ]);
    }
}
