<?php

namespace App\Service\Class;

use Psr\Container\ContainerInterface;

class ClassService
{
    public const SERVICE_NAME = 'class';

    protected $container;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
    }

    public function instanciateClass(string $className): mixed
    {
        // We check if class exist
        if (!class_exists($className)) {
            throw new \InvalidArgumentException(sprintf('La classe "%s" n\'existe pas.', $className));
        }

        if ($this->container->has($className)) {
            dd("It has $className");
        }

        dd("KO", $this->container);

        //We return the class instantiated with container
        return $this->container->get($className);
    }
}
