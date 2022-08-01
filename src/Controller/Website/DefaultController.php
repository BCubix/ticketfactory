<?php

namespace App\Controller\Website;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route("/admin/{reactRouting}", name: 'home', defaults: ["reactRouting" => null], requirements: ["reactRouting" => '.+'])]
    public function index(?string $reactRouting)
    {
        return $this->render('Default/index.html.twig');
    }
}

