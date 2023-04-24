<?php

namespace TicketFactory\Module\Info\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\Yaml\Parser;

class InfoExtension extends Extension implements PrependExtensionInterface
{
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container,
            new FileLocator(__DIR__ . '/../../config'));
        $loader->load('services.yaml');
    }

    public function prepend(ContainerBuilder $container)
    {
        $yamlParser = new Parser();
        $doctrineConfig = $yamlParser->parse(
            file_get_contents(__DIR__.'/../../config/packages/doctrine.yaml')
        );
        $container->prependExtensionConfig('doctrine', $doctrineConfig['doctrine']);
    }
}