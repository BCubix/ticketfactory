<?php

namespace App\Controller\Website;

use Symfony\Component\Routing\Annotation\Route;

class HomeController extends WebsiteController
{
    #[Route("/", name: 'home_website')]
    public function index()
    {
        return $this->render('@website/index.html.twig');
    }
}

