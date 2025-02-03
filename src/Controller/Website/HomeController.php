<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;

class HomeController extends WebsiteController
{
    public function index(Page $page)
    {
        $contentTypeBlocks = [];
        foreach ($page->getContentTypes() as $contentTypes) {
            if (null !== $contentTypes->getKeyword()) {
                $contentTypeBlocks[$contentTypes->getKeyword()] = $contentTypes->getContents();
            }
        }

        return $this->websiteRender('Home/index.html.twig', [
            'page'              => $page,
            'contentTypeBlocks' => $contentTypeBlocks,
            'homePage'          => true,
        ]);
    }
}
