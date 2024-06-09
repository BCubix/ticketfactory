<?php

namespace App\Service\Addon;

use App\Service\File\FileManipulator;
use Composer\Autoload\ClassLoader;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

abstract class Addon extends Bundle implements ConfigurationInterface
{
    protected $cl;
    protected $fm;

    public function __construct()
    {
        $this->cl = new ClassLoader();
        $this->fm = new FileManipulator();
    }

    public abstract function getConfiguration(): array;
    public abstract function getInfo(): array;

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
                ->scalarNode('name')
                    ->isRequired()
                    ->cannotBeEmpty()
                    ->validate()
                        ->ifTrue(function ($v) {
                            return !is_string($v);
                        })
                        ->thenInvalid('required string')
                    ->end()
                ->end()
                ->scalarNode('display_name')
                    ->isRequired()
                    ->cannotBeEmpty()
                    ->validate()
                        ->ifTrue(function ($v) {
                            return !is_string($v);
                        })
                        ->thenInvalid('required string')
                    ->end()
                ->end()
                ->enumNode('type')
                    ->isRequired()
                    ->cannotBeEmpty()
                    ->values(['module', 'theme'])
                ->end()
                ->scalarNode('category')
                    ->cannotBeEmpty()
                    ->validate()
                        ->ifTrue(function ($v) {
                            return !is_string($v);
                        })
                        ->thenInvalid('required string')
                    ->end()
                ->end()
                ->scalarNode('version')
                    ->isRequired()
                    ->cannotBeEmpty()
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
            ->end();
    }

    protected function addAuthor(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
                ->arrayNode('author')
                    ->isRequired()
                    ->children()
                        ->scalarNode('name')
                            ->isRequired()
                            ->cannotBeEmpty()
                            ->validate()
                                ->ifTrue(function ($v) {
                                    return !is_string($v);
                                })
                                ->thenInvalid('required string')
                            ->end()
                        ->end()
                        ->scalarNode('email')
                            ->isRequired()
                            ->cannotBeEmpty()
                            ->validate()
                                ->ifTrue(function ($v) {
                                    return !is_string($v);
                                })
                                ->thenInvalid('required string')
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();
    }

    protected function addHooks(ArrayNodeDefinition $node): void
    {
    }

    protected function addSettings(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
                ->arrayNode('settings')
                    ->isRequired()
                    ->children()
                        ->arrayNode('parameters')
                            ->useAttributeAsKey('name')
                            ->arrayPrototype()
                                ->children()
                                    ->scalarNode('displayName')
                                        ->isRequired()
                                        ->cannotBeEmpty()
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                    ->scalarNode('type')
                                        ->isRequired()
                                        ->cannotBeEmpty()
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                    ->scalarNode('defaultValue')
                                        ->defaultValue(null)
                                    ->end()
                                    ->arrayNode('availableValue')
                                        ->useAttributeAsKey('id')
                                        ->scalarPrototype()
                                            ->cannotBeEmpty()
                                        ->end()
                                    ->end()
                                    ->scalarNode('tabName')
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                    ->scalarNode('blockName')
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                    ->scalarNode('breakpointValue')
                                        ->defaultValue('xs-12 md-6')
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()

                        ->arrayNode('url')
                            ->useAttributeAsKey('keyword')
                            ->arrayPrototype()
                                ->children()
                                    ->scalarNode('name')
                                        ->isRequired()
                                        ->cannotBeEmpty()
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                    ->scalarNode('slug')
                                        ->isRequired()
                                        ->cannotBeEmpty()
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                    ->scalarNode('controller')
                                        ->isRequired()
                                        ->cannotBeEmpty()
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                    ->scalarNode('entity')
                                        ->defaultValue(null)
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                    ->scalarNode('urlBuilder')
                                        ->isRequired()
                                        ->cannotBeEmpty()
                                        ->validate()
                                            ->ifTrue(function ($v) {
                                                return !is_string($v);
                                            })
                                            ->thenInvalid('required string')
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();
    }
}
