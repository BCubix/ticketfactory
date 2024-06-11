<?php

namespace App\Controller\Website;

use App\Entity\Event\Room;
use App\Entity\Page\Page;
use App\Entity\Url\Url;

use Symfony\Component\HttpFoundation\Response;

class RoomController extends EventAbleController
{
    public function orchestrator(?Page $page, Url $url, string $slug)
    {
        $urlFormat = $url->getSlug();
        $attachedPage = $this->mf->get('room')->getAttachedPage($url);
        if (null !== $attachedPage) {
            $page = $attachedPage;

            $urlFormat = $this->mf->get('page')->getPageSlugPath($page) . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
        }

        $activeFilter = $this->getActiveFilter();
        $contents = $this->mf->get('room')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        $template = 'Room/' . ($this->getRequest()->isXmlHttpRequest() ? '_' : '') . 'index.html.twig';

        return $this->renderListPage($page, $contents, $template);
    }

    public function list(Page $page) {
        $request = $this->getRequest();

        $displayRooms = $this->mf->get("parameter")->getCoreParameter("display_rooms");
        if (!$displayRooms) {
            throw $this->createNotFoundException('This page does not exist.');
        }

        $rooms = $this->em->getRepository(Room::class)->findAllForWebsite($this->getLanguageId());

        $pageContent = [];
        if (null !== $page) {
            foreach ($page->getContents() as $content) {
                foreach ($content->getFields() as $key => $field) {
                    $pageContent[$key] = $field;
                }
            }
        }

        $template = 'Room/';
        $template .= ($request->isXmlHttpRequest() ? '_' : '');
        $template .= 'list.html.twig';

        return $this->websiteRender($template, [
            'page'               => $page,
            'rooms'              => $rooms,
            'pageContent'        => $pageContent,
        ]);
    }
}
