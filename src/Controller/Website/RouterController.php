<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RouterController extends WebsiteController
{
    #[Route('/{slugs}', name: 'tf_website_global', requirements: ['slugs' => '^(?!/en).*$'], priority: -100)]
    public function orchestrator(string $slugs): Response
    {
        // We explode url to get path as slug tokens
        $slugs = explode('/', $slugs);
        array_filter($slugs, function($value) {
            return !empty($value);
        });

        if ($slugs[0] == 'calendrier') {
            return $this->forward('TicketFactory\Module\Calendar\Controller\Website\CalendarController::index');
        }

        // If url ends with trailing slash, we redirect to the same url without it
        if (count($slugs) > 1 && empty($slugs[count($slugs) - 1])) {
            array_pop($slugs);
            $slugs = implode('/', $slugs);
            $params = array_merge(['slugs' => $slugs], $this->getRequest()->query->all());

            return $this->redirectToRoute('tf_website_global', $params);
        }

        // We continue to go down slugs hierarchy as long as they match pages
        $mainPage = null;
        foreach ($slugs as $slug) {
            $page = $this->mf->get('page')->getBySlug($slug);
            if (null === $page) {
                break;
            }

            if (
                (null === $mainPage && null == $page->getParent()) ||   // Page is at root hierarchy
                ($mainPage->getId() == $page->getParent()->getId())     // Page is another page's child
            ) {
                $mainPage = $page;
                array_shift($slugs);
            }
        }

        // We check for event relative content mapping
        $content = $this->forwardEventContents($mainPage, $slugs);
        if (null !== $content) {
            return $content;
        };

        // We check for other content mapping
        $content = $this->forwardOtherContents($mainPage, $slugs);
        if (null !== $content) {
            return $content;
        }

        // We check for page mapping
        $content = $this->forwardPages($mainPage, $slugs);
        if (null !== $content) {
            return $content;
        }
        
        throw $this->createNotFoundException('Cette page n\'existe pas.');
    }

    private function forwardEventContents(?Page $page, array $slugs): ?Response
    {
        if (count($slugs) == 0) {
            return null;
        }

        $keywords = ['season', 'room', 'eventCategory', 'tag'];
        foreach ($keywords as $keyword) {
            $content = $this->forwardEventRelation($keyword, $page, $slugs);
            if (null !== $content) {
                return $content;
            };
        }

        return $this->forwardEvent($page, $slugs);
    }

    private function forwardOtherContents(?Page $page, array $slugs): ?Response
    {
        if (count($slugs) == 0) {
            return null;
        }

        // @TODO : Add Content management

        return null;
    }

    private function forwardPages(?Page $page, array $slugs): ?Response
    {
        if (null == $page) {
            throw $this->createNotFoundException('Cette page n\'existe pas.');
        }

        $mappingArray = [
            'home' => 'App\Controller\Website\HomeController::index',
            'newsletter' => 'App\Controller\Website\NewsletterController::index',
            'calendar' => 'App\Controller\Website\CalendarController::index',
            'cookies' => 'App\Controller\Website\CookiesController::index',
            'contact' => 'App\Controller\Website\ContactRequestController::index'
        ];
        
        if (isset($mappingArray[$page->getKeyword()])) {
            return $this->forward($mappingArray[$page->getKeyword()], [
                'page'  => $page,
                'slugs' => $slugs
            ]);
        }

        return $this->forward('App\Controller\Website\PageController::index', [
            'page'  => $page,
            'slugs' => $slugs
        ]);
    }

    private function forwardEventRelation(string $keyword, ?Page $page, array $slugs): ?Response
    {
        $refPage = $this->mf->get('parameter')->get('page_' . $keyword);
        if ($page != $refPage) {
            return null;
        }

        $slug = array_shift($slugs);
        $content = $this->mf->get($keyword)->getBySlug($slug);
        if (null === $content || count($slugs) > 0) {
            return null;
        }

        $page ??= $this->mf->get('page')->getByKeyword('home');

        $controllerName = 'App\Controller\Website\\' . ucfirst($keyword) . 'Controller::index';
        return $this->forward($controllerName, [
            'page'   => $page,
            $keyword => $content,
            'slugs'  => $slugs
        ]);
    }

    private function forwardEvent(?Page $page, array $slugs): ?Response
    {
        $refPage = $this->mf->get('parameter')->get('page_event');
        if ($page != $refPage) {
            return null;
        }
        
        $event = $this->mf->get('event')->getFromUrl($slugs);
        if (null === $event) {
            return null;
        }

        return $this->forward('App\Controller\Website\EventController::index', [
            'page'  => $page,
            'event' => $event,
            'slugs' => $slugs
        ]);
    }
}
