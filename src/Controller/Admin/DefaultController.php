<?php

namespace App\Controller\Admin;

use App\Manager\ThemeManager;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    protected $tm;

    public function __construct(ThemeManager $tm)
    {
        $this->tm = $tm;
    }

    #[Route("{reactRouting}", name: 'home_admin', defaults: ["reactRouting" => null], requirements: ["reactRouting" => '^(?!api\/).+'])]
    public function index(?string $reactRouting)
    {
        return $this->render('Admin/' . $this->tm->getAdminMainTheme() . '/templates/Default/index.html.twig');
    }
}
