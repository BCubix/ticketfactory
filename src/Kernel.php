<?php

namespace App;

use App\Service\Db\Db;
use App\Service\File\PathGetter;
use App\Service\Object\GetClass;

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

        $container->import($configDir.'/{packages}/*.yaml');
        $container->import($configDir.'/{packages}/'.$this->environment.'/*.yaml');

        if (is_file($configDir.'/services.yaml')) {
            $container->import($configDir.'/services.yaml');
            $container->import($configDir.'/{services}_'.$this->environment.'.yaml');
        } else {
            $container->import($configDir.'/{services}.php');
        }

        $this->configureModulesServices($container);
    }

    public function registerBundles(): iterable
    {
        $bundles = require_once $this->getBundlesPath();

        $modulesActive = $this->getActiveModules();
        $modulesDir = $this->getModulesDir();

        // Add active modules in bundles list
        foreach ($modulesActive as $moduleActive) {
            $moduleName = $moduleActive['name'];

            // Find file bundle in module
            $bundleFilePath = $modulesDir . '/' . $moduleName . '/src/' . $moduleName . '.php';
            if (is_file($bundleFilePath)) {
                require_once $bundleFilePath;
            } else {
                throw new FileNotFoundException("Le module $moduleName n'a pas de fichier bundle.");
            }

            // Add module namespace in bundle list
            $bundleFileName = substr(basename($bundleFilePath), 0, -4);
            $moduleNamespace = 'TicketFactory\\Module\\' . $moduleName . '\\' . $bundleFileName;

            $bundles[$moduleNamespace] = ['all' => true];
        }
        
        foreach ($bundles as $class => $envs) {
            if ($envs[$this->environment] ?? $envs['all'] ?? false) {
                $bundle = new $class();

                if (method_exists($bundle, 'register')) {
                    $bundle->register();
                }

                yield $bundle;
            }
        }
    }

    private function configureRoutes(RoutingConfigurator $routes): void
    {
        $configDir = $this->getConfigDir();
        $routes->import($configDir.'/{routes}/annotations.php');
        $routes->import($configDir.'/{routes}/framework.yaml');
    }

    private function configureModulesServices(ContainerConfigurator &$container): void
    {
        $modulesActive = $this->getActiveModules();
        $services = $container->services();

        // Declare active modules services
        foreach ($modulesActive as $key => $moduleActive) {
            $moduleName = $moduleActive['name'];
            $moduleNamespace = 'TicketFactory\\Module\\' . $moduleName . '\\';
            $modulePath = ('../modules/' . $moduleName . '/src/');

            $services
                ->load($moduleNamespace, $modulePath)
                ->exclude($modulePath . '{DependencyInjection,Entity}')
                ->exclude($modulePath . $moduleName . '.php')
                ->public()
                ->autowire()
                ->autoconfigure()
            ;
        }   
    }

    private function getActiveModules(): array
    {
        try {
            return Db::getInstance()->query("SELECT * FROM module WHERE active = '1'");
        } catch (\Exception $e) {
            return [];
        }
    }

    private function getModulesDir(): string
    {
        $pg = new PathGetter($this->getProjectDir());

        return $pg->getModulesDir();
    }
}
