<?php

use App\Service\Db\Db;
use App\Service\File\PathGetter;

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes) {
    // Kernel
    $routes->import('../../src/Kernel.php', 'annotation');

    // Security
    $routes->add('admin_api_login_check', '/admin/api/login_check');
    $routes->add('gesdinet_jwt_refresh_token', '/admin/api/token/refresh')
           ->controller(["gesdinet.jwtrefreshtoken", 'refresh'])
    ;


    if ($routes->env() == 'dev') {
        $routes
            ->import('@WebProfilerBundle/Resources/config/routing/wdt.xml', 'xml')
            ->prefix('/_wdt')
        ;

        $routes
            ->import('@WebProfilerBundle/Resources/config/routing/profiler.xml', 'xml')
            ->prefix('/_profiler')
        ;

        $routes
            ->import('@FrameworkBundle/Resources/config/routing/errors.xml', 'xml')
            ->prefix('/_error')
        ;
    }


    // Core - Admin
    $routes
        ->import('../../src/Controller/Admin', 'annotation')
        ->prefix('/admin')
    ;

    // Core - Admin upload
    $routes
        ->import('.', 'uploader')
        ->prefix('/admin/api')
    ;

    // Modules
    try {
        $modulesActive = Db::getInstance()->query("SELECT * FROM module WHERE active = '1'");
    } catch (\Exception $e) {
        $modulesActive = [];
    }
    $moduleDir = (new PathGetter(__DIR__.'/../..'))->getModulesDir();
    foreach ($modulesActive as $moduleActive) {
        $controllersPath = $moduleDir . '/' . $moduleActive['name'] . '/src/Controller/Admin';
        if (is_dir($controllersPath)) {
            $routes
                ->import($controllersPath, 'annotation')
                ->prefix('/admin')
            ;
        }

        $controllersPath = $moduleDir . '/' . $moduleActive['name'] . '/src/Controller/Website';
        if (is_dir($controllersPath)) {
            $routes->import($controllersPath, 'annotation');
        }
    }

    $routes->import('../../src/Controller/Website', 'annotation');
};