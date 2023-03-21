<?php

namespace App\Controller\Website;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class HomeController extends WebsiteController
{
    #[Route("/", name: 'home_website')]
    public function index(Request $request)
    {
        return $this->websiteRender('index.html.twig', $request);
    }

    #[Route("/about", name: 'about_website')]
    public function about(Request $request)
    {
        return $this->websiteRender('index.html.twig', $request);
    }
}

