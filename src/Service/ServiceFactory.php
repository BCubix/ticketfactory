<?php

namespace App\Service;

use App\Service\Db\Db;

use Psr\Container\ContainerInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;

class ServiceFactory implements ServiceSubscriberInterface
{
    protected const TYPE_FILES_PATH = '/*/*.php';

    protected const MODULE_FOLDER = '/../../modules/';
    protected const MODULE_NAMESPACE_PATH = '/src/Service';

    protected $locator;

    public function __construct(ContainerInterface $locator)
    {
        $this->locator = $locator;
    }

    public static function getSubscribedServices(): array
    {
        $types = [
            ...self::getCoreServices(),
            ...self::getModuleServices(),
        ];

        return $types;
    }

    private static function getCoreServices(): array
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
                $typeName = 'service_' . $namespace::SERVICE_NAME;
                $types[$typeName] = $namespace;
            }
        }

        return $types;
    }

    private static function getModuleServices(): array
    {
        $types = [];
        $modules = Db::getInstance()->query("SELECT * FROM module WHERE active = '1'");

        foreach ($modules as $module) {
            $files = glob(__DIR__ . self::MODULE_FOLDER . $module['name'] . self::MODULE_NAMESPACE_PATH . self::TYPE_FILES_PATH);
            foreach ($files as $file) {
                $namespace = ['TicketFactory', 'Module', $module['name']];
                $srcFound = false;
                $moduleFound = false;

                $path = explode('/', $file);
                foreach ($path as $pathElement) {
                    if ($srcFound) {
                        $namespace[] = $pathElement;
                    }

                    if ($moduleFound && $pathElement == 'src') {
                        $srcFound = true;
                    }

                    if ($pathElement == 'modules') {
                        $moduleFound = true;
                    }
                }

                if (!$srcFound) {
                    throw new \Exception('Path must contain the "src" folder.');
                }


                $namespace = implode('\\', $namespace);
                $namespace = explode('.', $namespace);
                $namespace = $namespace[0];

                if (defined("$namespace::SERVICE_NAME")) {
                    $typeName = 'service_' . lcfirst($module['name']) . '_' . $namespace::SERVICE_NAME;
                    $types[$typeName] = $namespace;
                }
            }
        }

        return $types;
    }

    public function get(string $keyword)
    {
        $keyword = 'service_' . $keyword;

        if (!$this->locator->has($keyword)) {
            throw new \Exception('The service ' . $keyword . ' does not exist.');
        }

        return $this->locator->get($keyword);
    }
}
