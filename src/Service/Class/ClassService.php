<?php

namespace App\Service\Class;

use Symfony\Component\DependencyInjection\ContainerInterface;

class ClassService
{
    public const SERVICE_NAME = 'class';

    protected $container;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
    }

    public function getClass(string $className): mixed
    {
        if (!class_exists($className)) {
            throw new \InvalidArgumentException(sprintf('La classe "%s" n\'existe pas.', $className));
        }

        //We return the class instantiated with container
        return $this->container->get($className);
    }
}
