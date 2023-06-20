<?php

namespace App\Service\Addon;

use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;

class Theme extends Addon
{
    public const SERVICE_NAME = 'theme';

    protected function addSettings(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
                ->arrayNode('settings')->isRequired()
                    ->children()
                        ->arrayNode('modules')
                            ->addDefaultsIfNotSet()
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
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->arrayNode('modules_to_hook')
                                    ->arrayPrototype()
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
            ->end()
        ;
    }

    public function getConfiguration(): array
    {
        $config = Yaml::parseFile($this->getPath() . '/../config/config.yaml');
        if (!$config) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le fichier de configuration du thème $this->name est vide.");
        }

        $processor = new Processor();
        $config = $processor->processConfiguration($this, ['theme' => $config]);

        if (!isset($config['name']) || ($config['name'] != $this->name)) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le nom du theme renseigné dans le fichier de configuration doit être identique au nom de classe du theme.");
        }

        return $config;
    }

    public function getInfo(): array
    {
        $config = $this->getconfiguration();

        return [
            'name' => $config['name'],
            'displayName' => $config['display_name'],
            'description' => (isset($config['description']) ? $config['description'] : ''),
            'author' => $config['author'],
            'version' => $config['version']
        ];
    }
}