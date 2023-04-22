<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\User\User;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PageController extends WebsiteController
{
    public function index(string $slugs)
    {
        $userAddress = $this->getRequest()->get('u');
        $userPass = $this->getRequest()->get('t');
        $user = null;

        if (null  !== $userAddress && null !== $userPass) {
            $user = $this->em->getRepository(User::class)->getUserByTokenForWebsite($userAddress, $userPass);
        }

        $slugs = explode('/', $slugs);
        array_filter($slugs, function($value) {
            return !empty($value);
        });

        if (count($slugs) > 1 && empty($slugs[count($slugs) - 1])) {
            array_pop($slugs);
            $slugs = implode('/', $slugs);
            $params = array_merge(['slugs' => $slugs], $this->getRequest()->query->all());

            return $this->redirectToRoute('tf_website_orchestrator', $params);
        }

        $refPage = null;
        foreach ($slugs as $slug) {
            $page = $this->mf->get('page')->getBySlug($slug);
            if (null === $page) {
                break;
            }

            $this->em->detach($page);

            if ((null === $refPage) || ($refPage->getId() == $page->getParent()->getId())) {
                $refPage = $page;
                array_shift($slugs);
            }
        }

        if (null === $page || (false === $page->isActive() && (null === $user || !in_array("ROLE_ADMIN", $user->getRoles())))) {
            throw $this->createNotFoundException('This page does not exist.');
        }

        return $this->websiteRender('Page/index.html.twig', [ 'page' => $page]);
    }
}

