<?php

namespace App\Manager;

use App\Kernel;
use App\Entity\Technical\RequestsLog;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class RequestsLogManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'requestsLog';

    protected const ENTITY_CLASS = RequestsLog::class;

    protected $ph;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        UserPasswordHasherInterface $ph,
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->ph = $ph;
    }

    public function createNewRequest(string $clientIp, string $url): void
    {
        $hashedIp = hash('sha256', $clientIp);
        
        $log = new RequestsLog();
        $log->setIpAddress($hashedIp);
        $log->setUrl($url);

        $this->em->persist($log);
        $this->em->flush();
    }
}
