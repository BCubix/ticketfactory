<?php

use App\Service\ModuleTheme\Service\ModuleService;

use App\Utils\PathGetter;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes) {
    $routes->import('../../src/Kernel.php', 'annotation');

    $routes->add('admin_api_login_check', '/admin/api/login_check');
    $routes->add('gesdinet_jwt_refresh_token', '/admin/api/token/refresh')
           ->controller(["gesdinet.jwtrefreshtoken", 'refresh'])
    ;

    $websiteControllersPath = [];

    $modulesActive = ModuleService::getAllActive();
    $moduleDir = (new PathGetter(__DIR__.'/../..'))->getModulesDir();
    foreach ($modulesActive as $moduleActive) {
        $controllersPath = $moduleDir . '/' . $moduleActive['name'] . '/src/Controller/Admin';
        if (is_dir($controllersPath)) {
            $routes
                ->import($controllersPath, 'annotation')
                ->prefix('/admin/api')
            ;
        }

        $controllersPath = $moduleDir . '/' . $moduleActive['name'] . '/src/Controller/Website';
        if (is_dir($controllersPath)) {
            $websiteControllersPath[] = $controllersPath;
        }
    }

    $routes
        ->import('../../src/Controller/Admin', 'annotation')
        ->prefix('/admin')
    ;

    $routes
        ->import('.', 'uploader')
        ->prefix('/admin/api')
    ;

    foreach ($websiteControllersPath as $controllersPath) {
        $routes->import($controllersPath, 'annotation');
    }

    $routes->import('../../src/Controller/Website', 'annotation');
};