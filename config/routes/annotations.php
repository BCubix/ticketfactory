<?php

use App\Service\Module\ModuleService;
use Gesdinet\JWTRefreshTokenBundle\GesdinetJWTRefreshTokenBundle;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes) {
    $routes->import('../../src/Kernel.php', 'annotation');

    $routes->add('admin_api_login_check', '/admin/api/login_check');
    $routes->add('gesdinet_jwt_refresh_token', '/admin/api/token/refresh')
           ->controller([GesdinetJWTRefreshTokenBundle::class, 'refresh'])
    ;

    $modulesActive = ModuleService::getModulesActive();
    foreach ($modulesActive as $moduleActive) {
        $controllersPath = ModuleService::MODULES_DIR.'/'.$moduleActive['name'].'/src/Controller/Admin';
        if (is_dir($controllersPath)) {
            $routes
                ->import($controllersPath, 'annotation')
                ->prefix('/admin/api')
            ;
        }
    }

    $routes
        ->import('../../src/Controller/Admin', 'annotation')
        ->prefix('/admin/api')
    ;

    $routes
        ->import('.', 'uploader')
        ->prefix('/admin/api')
    ;

    $routes->import('../../src/Controller/Website', 'annotation');
};