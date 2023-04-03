<?php

namespace App\Manager;

use Psr\Container\ContainerInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;

class ManagerFactory implements ServiceSubscriberInterface
{
    protected const TYPE_FILES_PATH = '/*.php';
    protected const NAMESPACE_PATH = '\App\Manager\\';

    protected $locator;

    public function __construct(ContainerInterface $locator)
    {
        $this->locator = $locator;
    }

    public static function getSubscribedServices(): array
    {
        $types = [];

        $files = glob(__DIR__ . self::TYPE_FILES_PATH);
        foreach ($files as $file) {
            $namespace = ['App'];
            $srcFound = false;

            $path = explode('/', $file);
            foreach ($path as $pathElement) {
                if ($srcFound) {
                    $namespace[] = $pathElement;
                }
                
                if ($pathElement == 'src') {
                    $srcFound = true;
                }
            }

            if (!$srcFound) {
                throw new \Exception('Path must contain the "src" folder.');
            }

            $namespace = implode('\\', $namespace);
            $namespace = explode('.', $namespace);
            $namespace = $namespace[0];

            if (defined("$namespace::SERVICE_NAME")) {
                $typeName = 'manager_' . $namespace::SERVICE_NAME;
                $types[$typeName] = $namespace;
            }
        }

        return $types;
    }

    public function get(string $keyword)
    {
        $keyword = 'manager_' . $keyword;
        if (!$this->locator->has($keyword)) {
            throw new \Exception('The manager ' . $keyword . ' does not exist.');
        }

        return $this->locator->get($keyword);
    }
}
