<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\User\User;
use App\Entity\Event\Event;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EventController extends WebsiteController
{
    public function index(Event $event)
    {
        $userAddress = $this->getRequest()->get('u');
        $userPass = $this->getRequest()->get('t');
        $user = null;

        if (null  !== $userAddress && null !== $userPass) {
            $user = $this->em->getRepository(User::class)->getUserByTokenForWebsite($userAddress, $userPass);
        }

        if (null === $event || (false === $event->isActive() && (null === $user || !in_array("ROLE_ADMIN", $user->getRoles())))) {
            throw $this->createNotFoundException('This event does not exist.');
        }

        $medias = $this->mf->get('event')->getMediasFromEvent($event);

        return $this->websiteRender('Event/detail.html.twig', [
            'event'  => $event,
            'medias' => $medias,
        ]);
    }
}

