<?php

namespace App\Service\Addon;

use App\Exception\ApiException;
use App\Service\Exec\ExecService;
use App\Service\File\FileManipulator;

use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Yaml;

class Module extends Addon
{
    public const SERVICE_NAME = 'module';

    protected function addHooks(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
                ->arrayNode('hooks')
                    ->useAttributeAsKey('name')
                    ->scalarPrototype()
                ->end()
            ->end()
        ;
    }

    protected function addSettings(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
                ->arrayNode('settings')->isRequired()
                ->end()
            ->end()
        ;
    }

    public function getConfiguration(): array
    {
        $configPath = $this->getPath() . '/../config/config.yaml';
        if (!is_file($configPath)) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                ("Le fichier de configuration du module . $this->name . n\'a pas été trouvé. (" . $configPath . ")"));
        }

        $config = Yaml::parseFile($this->getPath() . '/../config/config.yaml');
        if (!$config) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le fichier de configuration du module $this->name est vide.");
        }

        $processor = new Processor();
        $config = $processor->processConfiguration($this, ['module' => $config]);

        if (!isset($config['name']) || ($config['name'] != $this->name)) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le nom du module renseigné dans le fichier de configuration doit être identique au nom de classe du module.");
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
            'version' => $config['version'],
            'hooks' => $config['hooks'],
        ];
    }

    /**
     * Register namespace for module autoload.
     *
     * @return void
     * @throws ApiException
     * @throws \InvalidArgumentException
     */
    public final function register(): void
    {
        // Namespace prefix of module
        //$prefix = 'TicketFactory\\Module\\' . $this->name . '\\';

        $this->cl->setPsr4($this->getNamespace() . '\\', $this->getPath());
        $this->cl->register();
    }
}
