<?php

namespace App;

use App\Service\Module\ModuleService;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    private function configureContainer(ContainerConfigurator $container, LoaderInterface $loader, ContainerBuilder $builder): void
    {
        $configDir = $this->getConfigDir();

        $container->import($configDir.'/{packages}/twig.php');
        $container->import($configDir.'/{packages}/*.yaml');
        $container->import($configDir.'/{packages}/'.$this->environment.'/*.yaml');

        if (is_file($configDir.'/services.yaml')) {
            $container->import($configDir.'/services.yaml');
            $container->import($configDir.'/{services}_'.$this->environment.'.yaml');
        } else {
            $container->import($configDir.'/{services}.php');
        }
    }

    public function registerBundles(): iterable
    {
        $bundles = require $this->getBundlesPath();

        $modulesActive = ModuleService::getAllActive();
        $moduleService = new ModuleService($this->getProjectDir());
        $moduleDir = $moduleService->getDir();

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
