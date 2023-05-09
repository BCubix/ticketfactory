<?php

namespace App\Controller\Website;

use Symfony\Component\HttpFoundation\Request;

class HomeController extends WebsiteController
{
    public function index()
    {
        $page = $this->mf->get('page')->getByKeyword('home');

        return $this->websiteRender('Home/index.html.twig');
    }
}

