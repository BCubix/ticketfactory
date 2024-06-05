<?php

namespace App\Controller\Website;

use App\Entity\Event\Room;
use App\Entity\Page\Page;
use Symfony\Component\HttpFoundation\Response;

class RoomController extends EventAbleController
{
    public function orchestrator(?Page $page, string $slug, string $urlFormat)
    {
        $parameterPage = $this->mf->get('parameter')->getCoreParameter('page_room');
        if (null !== $parameterPage) {
            $page = $parameterPage;

            $urlFormat = $page->getSlug() . (str_starts_with($urlFormat, '/') ? "" : "/") . $urlFormat;
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
