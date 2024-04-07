<?php

namespace App\Controller\Website;

use App\Entity\Event\EventCategory;
use App\Entity\Page\Page;
use App\Service\Sort\EventSorter;

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

        $events = $this->mf->get('event')->getEvents(['category' => [$eventCategory->getId()]]);
        $events = EventSorter::sortEvents($events, true);

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        return $this->websiteRender('EventCategory/index.html.twig', [
            'page'           => $page,
            'eventCategory'  => $eventCategory,
            'activeEvents'   => $events['active'],
            'inactiveEvents' => $events['inactive'],
            'pageContent'        => $pageContent,
        ]);
    }
}
