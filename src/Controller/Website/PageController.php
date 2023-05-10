<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\User\User;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PageController extends WebsiteController
{
    public function index(Page $page)
    {
        $userAddress = $this->getRequest()->get('u');
        $userPass = $this->getRequest()->get('t');
        $user = null;

        if (null  !== $userAddress && null !== $userPass) {
            $user = $this->em->getRepository(User::class)->getUserByTokenForWebsite($userAddress, $userPass);
        }


        if (null === $page || (false === $page->isActive() && (null === $user || !in_array("ROLE_ADMIN", $user->getRoles())))) {
            throw $this->createNotFoundException('This page does not exist.');
        }

        return $this->websiteRender('Page/index.html.twig', [ 'page' => $page]);
    }
}

