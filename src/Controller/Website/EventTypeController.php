<?php

namespace App\Controller\Website;

use App\Entity\Event\EventType;
use App\Entity\Page\Page;
use App\Entity\Url\Url;

use Symfony\Component\HttpFoundation\Response;

class EventTypeController extends EventAbleController
{
    public function orchestrator(?Page $page, Url $url, string $slug)
    {
        $urlFormat = $url->getSlug();
        $attachedPage = $this->mf->get('eventType')->getAttachedPage($url);
        if (null !== $attachedPage) {
            $page = $attachedPage;

            $urlFormat = $this->mf->get('page')->getPageSlugPath($page) . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('eventType')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        $breadcrumbs = $this->mf->get('eventType')->generateBreadcrumbs($attachedPage, $url, $slug, $contents);
        $template = 'EventType/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $breadcrumbs, $template);
    }

    public function list(Page $page) {
        $request = $this->getRequest();
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        $eventTypes = $this->em->getRepository(EventType::class)->findAllForWebsite($this->getLanguageId());

        $template = 'EventType/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'eventTypes'         => $eventTypes,
        ]);
    }
}
