<?php

namespace App\Service\Addon;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\Yaml\Parser;

abstract class ModuleExtension extends Extension implements PrependExtensionInterface
{
    protected const LOAD_CONFIGS = null;
    protected const PREPEND_CONFIGS = null;

    protected array $loadResources;
    protected array $prependConfigs;

    public function __construct()
    {
        $this->loadResources = static::LOAD_CONFIGS;
        $this->prependConfigs = static::PREPEND_CONFIGS;
    }

    public function load(array $configs, ContainerBuilder $container)
    {
        $this->loadConfigs($container);
    }

    public function prepend(ContainerBuilder $container)
    {
        $this->prependExtensionConfigs($container);
    }

    private function loadConfigs(ContainerBuilder $container)
    {
        $loader = new YamlFileLoader(
            $container,
            new FileLocator($this->getExtensionPath() . '/../../config')
        );
        foreach ($this->loadResources as $resource) {
            $loader->load($resource);
        }
    }

    private function prependExtensionConfigs(ContainerBuilder $container)
    {
        $yamlParser = new Parser();
        foreach ($this->prependConfigs as $extensionName => $configFile) {
            $config = $yamlParser->parse(
                file_get_contents($this->getExtensionPath() . '/../../config/' . $configFile)
            );
            $container->prependExtensionConfig($extensionName, $config[$extensionName]);
        }
    }

    private function getExtensionPath()
    {
        $reflected = new \ReflectionObject($this);
        return dirname($reflected->getFileName());
    }
}
