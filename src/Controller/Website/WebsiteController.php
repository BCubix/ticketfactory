<?php

namespace App\Controller\Website;

use App\Manager\ThemeManager;
use App\Service\Hook\HookService;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Response;

abstract class WebsiteController extends AbstractFOSRestController
{
    protected $em;
    protected $hs;
    protected $tm;

    public function __construct(EntityManagerInterface $em, HookService $hs, ThemeManager $tm)
    {
        $this->em = $em;
        $this->hs = $hs;
        $this->tm = $tm;
    }

    protected function websiteRender(string $twigFilename): Response
    {
        return $this->render('Website/' . $this->tm->getWebsiteMainTheme() . '/templates/' . $twigFilename);
    }
}
