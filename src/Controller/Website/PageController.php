<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\User\User;

class PageController extends WebsiteController
{
    public function index(Page $page)
    {
        $this->checkAccessPage($page);

        $pageTypeBlocks = [];
        foreach ($page->getContents() as $content) {
            foreach ($content->getFields() as $key => $field) {
                $pageTypeBlocks[$key] = $field;
            }
        }

        $contentTypeBlocks = [];
        foreach ($page->getContentTypes() as $contentTypes) {
            if (null !== $contentTypes->getKeyword()) {
                $contentTypeBlocks[$contentTypes->getKeyword()] = $contentTypes->getContents();
            }
        }

        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        return $this->websiteRender('Page/index.html.twig', [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'pageTypeBlocks'     => $pageTypeBlocks,
            'contentTypeBlocks'  => $contentTypeBlocks
        ]);
    }

    public function history(Page $page)
    {
        $this->checkAccessPage($page);
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        $pageContents = [];
        foreach ($page->getContents() as $content) {
            foreach ($content->getFields() as $key => $field) {
                $pageContents[$key] = $field;
            }
        }

        return $this->websiteRender('Page/history.html.twig', [
            'breadcrumbs'        => $breadcrumbs,
            'page'               => $page,
            'pageContents'       => $pageContents
        ]);
    }

    private function checkAccessPage(Page $page): void
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
    }
}
