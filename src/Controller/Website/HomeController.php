<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;

use Symfony\Component\HttpFoundation\Request;

class HomeController extends WebsiteController
{
    public function index(Page $page)
    {
        $pageTypeBlocks = [];
        foreach ($page->getContents() as $content) {
            foreach($content->getFields() as $key => $field) {
                $pageTypeBlocks[$key] = $field;
            }
        }

        return $this->websiteRender('Home/index.html.twig', [
            'page'           => $page,
            'pageTypeBlocks' => $pageTypeBlocks,
        ]);
    }
}

