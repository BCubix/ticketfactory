<?php

namespace App\Controller\Website;

use App\Entity\Event\Room;
use App\Entity\Page\Page;
use App\Entity\User\User;
use Symfony\Component\HttpFoundation\Response;

class RoomController extends WebsiteController
{
    public function orchestrator(?Page $page, string $slug, string $urlFormat)
    {
        $userAddress = $this->getRequest()->get('u');
        $userPass = $this->getRequest()->get('t');
        $user = null;

        if (null  !== $userAddress && null !== $userPass) {
            $user = $this->em->getRepository(User::class)->getUserByTokenForWebsite($userAddress, $userPass);
        }

        $activeFilter = true;
        if (null !== $user && in_array("ROLE_ADMIN", $user->getRoles())) {
            $activeFilter = false;
        }

        $contents = $this->mf->get('room')->getObjectFromUrl($slug, $urlFormat, $activeFilter);
        if (null === $contents) {
            return new Response(null, 404);
        }

        return $this->index($page, $contents['Room'], $contents);
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

    public function index(?Page $page, ?Room $season, ?array $contents)
    {
    }
}
