<?php

namespace App\Controller\Admin;

use App\Service\Error\FormErrorsCollector;
use App\Service\Log\Logger;
use App\Manager\LanguageManager;
use App\Manager\HookManager;
use App\Manager\ManagerFactory;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use JMS\Serializer\SerializerInterface;

abstract class AdminController extends AbstractFOSRestController
{
    protected $em;
    protected $se;
    protected $fec;
    protected $log;
    protected $lm;
    protected $hm;
    protected $mf;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        LanguageManager $lm,
        HookManager $hm,
        ManagerFactory $mf
    ) {
        $this->em = $em;
        $this->se = $se;
        $this->fec = $fec;
        $this->log = $log;
        $this->lm = $lm;
        $this->hm = $hm;
        $this->mf = $mf;
    }
}
