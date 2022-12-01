<?php

namespace App\Service\ModuleTheme\Config;

use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class ThemeConfig implements ConfigurationInterface
{
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('theme');

        $rootNode = $treeBuilder->getRootNode();

        $this->addInfo($rootNode);
        $this->addAuthor($rootNode);
        $this->addGlobalSettings($rootNode);

        return $treeBuilder;
    }

    private function addInfo(ArrayNodeDefinition $node)
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

    private function addAuthor(ArrayNodeDefinition $node)
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

    private function addGlobalSettings(ArrayNodeDefinition $node)
    {
        $node
            ->children()
                ->arrayNode('global_settings')->isRequired()
                    ->children()
                        ->arrayNode('modules')
                            ->children()
                                ->arrayNode('to_enable')
                                    ->scalarPrototype()
                                        ->cannotBeEmpty()
                                        ->validate()
                                            ->ifTrue(function ($v) { return !is_string($v); } )
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                ->end()
                                ->arrayNode('to_disable')
                                    ->scalarPrototype()
                                        ->cannotBeEmpty()
                                        ->validate()
                                            ->ifTrue(function ($v) { return !is_string($v); } )
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                        ->arrayNode('hooks')
                            ->children()
                                ->arrayNode('modules_to_hook')
                                ->end()
                            ->end()
                        ->end()
                        ->arrayNode('images_types')
                            ->arrayPrototype()
                            ->children()
                                ->integerNode('width')->isRequired()->end()
                                ->integerNode('height')->isRequired()->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;
    }
}