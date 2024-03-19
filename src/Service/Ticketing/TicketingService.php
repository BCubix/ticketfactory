<?php

namespace App\Service\Ticketing;

use App\Entity\Addon\Module;
use Symfony\Component\DependencyInjection\ContainerInterface;

class TicketingService
{
    public const SERVICE_NAME = 'ticketing';

    protected $container;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
    }

    public function getTicketingClass(?Module $module): mixed
    {
        if (null === $module) {
            return null;
        }

        // We check if class exist
        $className = 'TicketFactory\Module\\' . $module->getName() . '\Manager\TicketingManager';
        if (!class_exists($className)) {
            throw new \InvalidArgumentException(sprintf('La classe "%s" n\'existe pas.', $module->getName()));
        }

        //We return the class instantiated with container 
        return $this->container->get($className);
    }
}
