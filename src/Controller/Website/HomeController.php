<?php

namespace App\Controller\Website;

use Symfony\Component\HttpFoundation\Request;

class HomeController extends WebsiteController
{
    public function index()
    {
        return $this->websiteRender('Home/index.html.twig');
    }
}

