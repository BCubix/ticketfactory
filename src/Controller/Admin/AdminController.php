<?php

namespace App\Controller\Admin;

use App\Service\Error\FormErrorsCollector;
use App\Service\Hook\HookService;
use App\Service\Log\Logger;
use App\Manager\LanguageManager;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use JMS\Serializer\SerializerInterface;

abstract class AdminController extends AbstractFOSRestController
{
    protected $em;
    protected $se;
    protected $fec;
    protected $log;
    protected $hs;
    protected $lm;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        LanguageManager $lm
    ) {
        $this->em = $em;
        $this->se = $se;
        $this->fec = $fec;
        $this->log = $log;
        $this->hs = $hs;
        $this->lm = $lm;
    }
}
