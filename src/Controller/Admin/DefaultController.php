<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route("{reactRouting}", name: 'home', defaults: ["reactRouting" => null], requirements: ["reactRouting" => '^(?!api\/).+'])]
    public function index(?string $reactRouting)
    {
        return $this->render('Default/index.html.twig');
    }
}

