<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;

class HomeController extends WebsiteController
{
    public function index(Page $page)
    {
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

        return $this->websiteRender('Home/index.html.twig', [
            'page'              => $page,
            'pageTypeBlocks'    => $pageTypeBlocks,
            'contentTypeBlocks' => $contentTypeBlocks,
            'homePage'          => true,
        ]);
    }
}
