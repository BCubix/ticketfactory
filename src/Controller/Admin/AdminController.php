<?php

namespace App\Controller\Admin;

use App\Service\Error\FormErrorsCollector;
use App\Service\Log\Logger;
use App\Manager\LanguageManager;
use App\Manager\HookManager;

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

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        LanguageManager $lm,
        HookManager $hm
    ) {
        $this->em = $em;
        $this->se = $se;
        $this->fec = $fec;
        $this->log = $log;
        $this->lm = $lm;
        $this->hm = $hm;
    }
}
