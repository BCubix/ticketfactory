<?php

namespace App\Service\Addon;

use Composer\Autoload\ClassLoader;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

abstract class Addon extends Bundle implements ConfigurationInterface
{
    public const SERVICE_NAME = 'themeConfig';

    protected $cl;

    public function __construct()
    {
        $this->cl = new ClassLoader();
    }

    public abstract function getConfiguration(): array;
    public abstract function getInfo(): array;
    protected abstract function addSettings(ArrayNodeDefinition $node): void;

    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('theme');

        $rootNode = $treeBuilder->getRootNode();

        $this->addInfo($rootNode);
        $this->addAuthor($rootNode);
        $this->addHooks($rootNode);
        $this->addSettings($rootNode);

        return $treeBuilder;
    }

    protected function addInfo(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
                ->scalarNode('name')->isRequired()->cannotBeEmpty()
                    ->validate()
                        ->ifTrue(function ($v) { return !is_string($v); } )
                        ->thenInvalid('required string')
                    ->end()
                ->end()
                ->scalarNode('display_name')->isRequired()->cannotBeEmpty()
                    ->validate()
                        ->ifTrue(function ($v) { return !is_string($v); } )
                        ->thenInvalid('required string')
                    ->end()
                ->end()
                ->enumNode('type')->isRequired()->cannotBeEmpty()
                    ->values(['module', 'theme'])
                ->end()
                ->scalarNode('version')->isRequired()->cannotBeEmpty()
                    ->validate()
                        ->ifTrue(function ($v) {
                            $intStrArray = explode('.', $v);
                            $filters = array_filter($intStrArray, function ($intStr) {
                                return strval(intval($intStr)) !== $intStr;
                            });
                            return !empty($filters);
                        })
                        ->thenInvalid('required version in float (example: 1.0.0.0)')
                    ->end()
                ->end()
            ->end()
        ;
    }

    protected function addAuthor(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
                ->arrayNode('author')->isRequired()
                    ->children()
                        ->scalarNode('name')->isRequired()->cannotBeEmpty()
                            ->validate()
                                ->ifTrue(function ($v) { return !is_string($v); } )
                                ->thenInvalid('required string')
                            ->end()
                        ->end()
                        ->scalarNode('email')->isRequired()->cannotBeEmpty()
                            ->validate()
                                ->ifTrue(function ($v) { return !is_string($v); } )
                                ->thenInvalid('required string')
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;
    }

    protected function addHooks(ArrayNodeDefinition $node): void
    {
        
    }
}