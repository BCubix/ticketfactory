<?php

namespace App\Controller\Website;

use App\Entity\Event\Room;
use App\Entity\Page\Page;

class RoomController extends WebsiteController
{
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
