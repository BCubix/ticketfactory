<?php

namespace App\Controller\Website;

use App\Entity\Event\EventCategory;
use App\Entity\Page\Page;
use Symfony\Component\HttpFoundation\Response;

class EventCategoryController extends EventAbleController
{
    public function orchestrator(?Page $page, string $slug, string $urlFormat)
    {
        $parameterPage = $this->mf->get('parameter')->getCoreParameter('page_eventCategory');
        if (null !== $parameterPage) {
            $page = $parameterPage;

            if ($page->getSlug() === $slug && $page->isActive()) {
                return $this->list($page);
            }

            $urlFormat = $page->getSlug() . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('eventCategory')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        $template = 'EventCategory/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $template);
    }

    public function list(Page $page) {
        $request = $this->getRequest();

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
            'page'               => $page,
            'eventCategories'    => $eventCategories,
            'pageContent'        => $pageContent,
        ]);
    }
}
