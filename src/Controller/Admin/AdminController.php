<?php

namespace App\Controller\Admin;

use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

abstract class AdminController extends AbstractFOSRestController
{
    protected $ed;
    protected $em;
    protected $se;
    protected $fec;

    public function __construct(EventDispatcherInterface $ed, EntityManagerInterface $em, SerializerInterface $se, FormErrorsCollector $fec)
    {
        $this->ed = $ed;
        $this->em = $em;
        $this->se = $se;
        $this->fec = $fec;
    }
}
