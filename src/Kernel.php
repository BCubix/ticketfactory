<?php

namespace App;

use App\Service\Module\ModuleService;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function registerBundles(): iterable
    {
        $bundles = require $this->getBundlesPath();

        $modulesActive = ModuleService::getModulesActive();
        $moduleService = new ModuleService($this->getProjectDir());
        $moduleDir = $moduleService->getModuleDir();

        // Add active modules in bundles list
        foreach ($modulesActive as $moduleActive) {
            $moduleName = $moduleActive['name'];

            // Register first the namespace of module
            $moduleService->callConfig($moduleName, 'register');

            // Find file bundle in module
            $bundleFilePath = $moduleDir . '/' . $moduleName . '/src/' . $moduleName . '.php';
            if (!is_file($bundleFilePath)) {
                throw new FileNotFoundException("Le module $moduleName n'a pas de fichier bundle.");
            }

            // Add module namespace in bundle list
            $bundleFileName = substr(basename($bundleFilePath), 0, -4);
            $moduleNamespace = 'TicketFactory\\Module\\' . $moduleName . '\\' . $bundleFileName;
            $bundles[$moduleNamespace] = ['all' => true];
        }

        foreach ($bundles as $class => $envs) {
            if ($envs[$this->environment] ?? $envs['all'] ?? false) {
                yield new $class();
            }
        }
    }

    private function configureRoutes(RoutingConfigurator $routes): void
    {
        $configDir = $this->getConfigDir();
        $routes->import($configDir.'/{routes}/annotations.php');
        $routes->import($configDir.'/{routes}/framework.yaml');
    }
}
