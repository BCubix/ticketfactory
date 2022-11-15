<?php

namespace App;

use App\Service\Module\ModuleService;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function registerBundles(): iterable
    {
        $contents = require $this->getBundlesPath();
        $modulesActive = ModuleService::getModulesActive();

        foreach ($modulesActive as $moduleActive) {
            $name = $moduleActive['name'];

            ModuleService::callConfig($name, 'register');

            $filesBundle = glob(ModuleService::MODULES_DIR.'/'.$name.'/src/*.php');
            foreach ($filesBundle as $fileBundlePath) {
                $fileBundleName = substr(basename($fileBundlePath), 0, -4);
                $namespace = $name.'\\'.$fileBundleName;
                $contents[$namespace] = ['all' => true];
            }
        }

        foreach ($contents as $class => $envs) {
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
