<?php

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\DependencyInjection\Reference;

return function (ContainerConfigurator $configurator) {
    $configurator->parameters()
        ->set('jms_serializer.doctrine_proxy_subscriber.class', 'App\EventSubscriber\Admin\DoctrineProxySubscriber')
        ->set('ticketing_url', '%env(TICKETING_URL)%');

    $services = $configurator->services()
        ->defaults()
        ->autowire(true) // Automatically injects dependencies in your services.
        ->autoconfigure(true); // Automatically registers your services as commands, event subscribers, etc.

    // Services from src/ directory
    $services->load('App\\', '../src/')
        ->exclude(['../src/DependencyInjection/', '../src/Entity/', '../src/Kernel.php']);

    // Hooks
    $services->load('App\Hook\\', '../src/Hook')
        ->public();

    // Event Subscribers / Event Listeners
    $services->set('App\EventSubscriber\Admin\ApiExceptionSubscriber')
        ->tag('kernel.event_subscriber');

    $services->set('App\EventSubscriber\Admin\DoctrineSubscriber')
        ->tag('doctrine.event_subscriber');

    $services->set('App\EventSubscriber\Admin\FileUploader')
        ->args(['$rootPath' => '%kernel.project_dir%'])
        ->tag('kernel.event_subscriber', ['event' => 'oneup_uploader.post_persist']);

    $services->set('App\EventSubscriber\Admin\FrontUrlSubscriber')
        ->tag('jms_serializer.event_subscriber');

    $services->set('App\EventSubscriber\Admin\RequestSubscriber')
        ->args(['$container' => new Reference('service_container')]);

    $services->set('App\Service\Ticketing\TicketingService')
        ->args(['$container' => new Reference('service_container')]);

    $services->set('App\Service\Class\ClassService')
        ->args(['$container' => new Reference('service_container')]);

    if (extension_loaded('memcached')) {
        $services->set('App\Manager\CacheManager')
        ->call('setCache', [new Reference('cache.app')]);
    }

    // Server Side Rendering
    $services->set('limenius_react.react_renderer', 'App\Service\Rendering\CustomPhpExecJsReactRenderer')
        ->args([
            '%kernel.project_dir%/public',
            '%limenius_react.fail_loud%',
            new Reference('limenius_react.context_provider'),
            new Reference('logger')
        ])
        ->call('setPackage', ['@assets.packages', 'build/app.js']); // Utilisation de `call()` pour appeler la méthode setPackage

    // Utils
    $services->set('App\Service\File\PathGetter')
        ->args(['$projectDir' => '%kernel.project_dir%']);
};
