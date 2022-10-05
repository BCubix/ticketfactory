<?php

namespace App\Service\Logger;

use App\Entity\Technical\Log;
use App\Entity\User\User;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Security;

class Logger
{
    private $em;
    private $sc;

    public function __construct(EntityManagerInterface $em, Security $sc) {
        $this->em = $em;
        $this->sc = $sc;
    }

    public function log(int $severity, ?int $errorCode, string $message, ?string $objectName = null, ?int $objectId = null)
    {
        $objectName = explode('\\', $objectName);
        $objectName = $objectName[count($objectName) - 1];

        $log = new Log();
        $log->setUser($this->sc->getUser());
        $log->setSeverity($severity);
        $log->setErrorCode($errorCode);
        $log->setMessage($message);
        $log->setObjectName($objectName);
        $log->setObjectId($objectId);

        $this->em->persist($log);
        $this->em->flush();
    }

    public function getLogs(array $filters = []) {
        return $this->em->getRepository(Log::class)->findAllForAdmin($filters);
    }
}
