<?php

namespace App\Controller\Website;

use App\Service\Hook\HookService;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;

abstract class WebsiteController extends AbstractFOSRestController
{
    protected $em;
    protected $hs;

    public function __construct(EntityManagerInterface $em, HookService $hs)
    {
        $this->em = $em;
        $this->hs = $hs;
    }
}
