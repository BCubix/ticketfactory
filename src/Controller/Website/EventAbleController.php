<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\User\User;
use App\Form\Website\Event\EventFilterType;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Request;

class EventAbleController extends WebsiteController
{
    protected function eventList(array $contents)
    {
        $request = $this->getRequest();

        $sortAvailableValues = $this->mf->get('parameter')->getParameter('core_event_default_sort')->getAvailableValue();
        $sort = [];
        foreach($sortAvailableValues as $availableValue) {
            $sort[$availableValue['name']] = $availableValue['id'];
        }

        $filters = [];
        $filterParams = $this->mf->get("event")->getFilterParams([...$contents]);

        $filterForm = $this->createForm(EventFilterType::class, null, ['filterParams' => $filterParams, 'sort' => $sort]);
        $filterForm->handleRequest($request);
        if ($filterForm->isSubmitted() && $filterForm->isValid()) {
            $filters = $filterForm->getData();
            $filters = $this->getFilterFormData($filters);
        }

        $filters = $this->getContentFilter($request, $filters, $contents);
        $events = $this->mf->get('event')->getSortedEvents($filters);

        return [
            'activeEvents'       => $events['active'],
            'inactiveEvents'     => $events['inactive'],
            'filterForm'         => $filterForm->createView(),
            'filterParams'       => $filterParams,
            'pagination'         => [
                'page'               => $filters['page'],
                'limit'              => $filters['limit'],
                'activeTotal'        => $events['activeTotal'],
                'inactiveTotal'      => $events['inactiveTotal'],
                'activeMaxPage'      => $this->mf->get('event')->getMaxPage($events['activeTotal'], $filters['limit']),
                'inactiveMaxPage'    => $this->mf->get('event')->getMaxPage($events['inactiveTotal'], $filters['limit']),
            ]
        ];
    }

    protected function getFilterFormData(array $filters): array
    {
        $filters =  [
            ...$filters,
            'room'   => isset($filters['room']) ? $filters['room']->getId() : null,
            'season' => isset($filters['season']) ? $filters['season']->getId() : null,
            'type'   => isset($filters['type']) ? $filters['type']->getId() : null,
        ];

        if (isset($filters['category'])) {
            $categories = [];
            foreach($filters['category'] as $category) {
                $categories[] = $category->getId();
            }
            $filters['category'] = new ArrayCollection($categories);
        }

        if (isset($filters['tag'])) {
            $tags = [];
            foreach($filters['tag'] as $tag) {
                $tags[] = $tag->getId();
            }
            $filters['tag'] = new ArrayCollection($tags);
        }

        return $filters;
    }

    protected function getContentFilter(Request $request, array $filters, array $contents): array
    {
        $filters = [
            ...$filters,
            'page'      => intval($request->get('page')) > 0 ? intval($request->get('page')) : 1,
            'limit'     => $this->mf->get('parameter')->getCoreParameter('event_limit'),
        ];

        $contentsLinkTab = [
            'EventCategory'  => fn ($content) => (['key' => 'eventCategory', 'value' => [$content->getId()]]),
            'Room'           => fn ($content) => (['key' => 'room', 'value' => $content->getId()]),
            'Season'         => fn ($content) => (['key' => 'season', 'value' => $content->getId()]),
            'Tag'            => fn ($content) => (['key' => 'tag', 'value' => [$content->getId()]]),
            'EventType'      => fn ($content) => (['key' => 'eventType', 'value' => $content->getId()]),
        ];

        foreach($contents as $key => $content) {
            if (isset($contentsLinkTab[$key])) {
                $contentData = $contentsLinkTab[$key]($content);
                $filters[$contentData['key']] = $contentData['value'];
            }
        }

        return $filters;
    }

    protected function renderContents(array $contents): array
    {
        $result = [];
        foreach($contents as $key => $content) {
            $result[lcfirst($key)] = $content;
        }

        return $result;
    }

    protected function getPageContent(?Page $page)
    {
        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }
    }

    protected function renderPage(string $templateName, array $contents)
    {
        return $this->websiteRender($templateName, $contents);
    }

    protected function renderListPage(?Page $page, array $contents, string $templateName)
    {
        $eventContents = $this->eventList($contents);
        $pageContent = $this->getPageContent($page);

        return $this->renderPage($templateName, [
            ...$contents,
            ...$eventContents,
            'page' => $page,
            'pageContent' => $pageContent,
        ]);
    }

    protected function getActiveFilter(): bool
    {
        $userAddress = $this->getRequest()->get('u');
        $userPass = $this->getRequest()->get('t');
        $user = null;

        if (null  !== $userAddress && null !== $userPass) {
            $user = $this->em->getRepository(User::class)->getUserByTokenForWebsite($userAddress, $userPass);
        }

        if (null !== $user && in_array("ROLE_ADMIN", $user->getRoles())) {
            return false;
        }

        return true;
    }
}