<?php

namespace App\Controller\Website;

use App\Entity\Event\EventCategory;
use App\Entity\Page\Page;


use Symfony\Component\HttpFoundation\RedirectResponse;

class EventCategoryController extends WebsiteController
{
    public function index(Page $page, EventCategory $eventCategory)
    {
        if ($this->getLanguageId() != $this->getDefaultLanguageId()) {
            $this->em->clear();

            $eventCategory = $this->em->getRepository(EventCategory::class)->findTranslationForWebsite($this->getDefaultLanguageId(), $eventCategory->getLanguageGroup());

            return new RedirectResponse($this->sf->get('urlService')->tfPath($eventCategory, ['_locale' => $this->getDefaultLocale()]), 302);
        }

        $request = $this->getRequest();

        $filters = [
            'category'  => [$eventCategory->getId()],
            'sort'      => $request->get('sort') ?? $this->mf->get('parameter')->getCoreParameter('event_default_sort'),
            'page'      => $request->get('page') ?? 1,
            'limit'     => $this->mf->get('parameter')->getCoreParameter('event_limit'),
        ];

        $events = $this->mf->get('event')->getSortedEvents($filters);

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
        $template .= 'index.html.twig';

        return $this->websiteRender($template, [
            'page'           => $page,
            'eventCategory'  => $eventCategory,
            'activeEvents'   => $events['active'],
            'inactiveEvents' => $events['inactive'],
            'pageContent'        => $pageContent,
            'pagination'         => [
                'page'               => $filters['page'],
                'limit'              => $filters['limit'],
                'activeTotal'        => $events['activeTotal'],
                'inactiveTotal'      => $events['inactiveTotal'],
                'activeMaxPage'      => $this->mf->get('event')->getMaxPage($events['activeTotal'], $filters['limit']),
                'inactiveMaxPage'    => $this->mf->get('event')->getMaxPage($events['inactiveTotal'], $filters['limit']),
            ]
        ]);
    }
}
