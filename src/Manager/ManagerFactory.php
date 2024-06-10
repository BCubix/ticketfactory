<?php

namespace App\Manager;

use App\Service\Db\Db;
use Psr\Container\ContainerInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;

class ManagerFactory implements ServiceSubscriberInterface
{
    protected const TYPE_FILES_PATH = '/*.php';

    protected const MODULE_FOLDER = '/../../modules/';
    protected const MODULE_NAMESPACE_PATH = '/src/Manager';

    protected $locator;

    public function __construct(ContainerInterface $locator)
    {
        $this->locator = $locator;
    }

    public static function getSubscribedServices(): array
    {
        $types = [
            ...self::getCoreManagers(),
            ...self::getModuleManagers(),
        ];

        return $types;
    }

    private static function getCoreManagers(): array
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

    private static function getModuleManagers(): array
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
                    $typeName = 'manager_' . lcfirst($module['name']) . '_' . $namespace::SERVICE_NAME;
                    $types[$typeName] = $namespace;
                }
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
