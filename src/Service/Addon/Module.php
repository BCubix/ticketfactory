<?php

namespace App\Service\Addon;

use App\Exception\ApiException;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Yaml;

class Module extends Addon
{
    public const SERVICE_NAME = 'module';

    protected const ENTITY_TRAITS = [];
    protected const REPOSITORY_TRAITS = [];

    protected function addHooks(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
            ->arrayNode('hooks')
            ->useAttributeAsKey('name')
            ->scalarPrototype()
            ->end()
            ->end();
    }

    /* protected function addSettings(ArrayNodeDefinition $node): void
    {
        $node
            ->children()
                ->arrayNode('settings')->isRequired()
                ->end()
            ->end()
        ;
    } */

    public function getConfiguration(): array
    {
        $configPath = $this->getPath() . '/../config/config.yaml';
        if (!is_file($configPath)) {
            throw new ApiException(
                Response::HTTP_INTERNAL_SERVER_ERROR,
                1500,
                ("Le fichier de configuration du module . $this->name . n\'a pas été trouvé. (" . $configPath . ")")
            );
        }

        $config = Yaml::parseFile($this->getPath() . '/../config/config.yaml');
        if (!$config) {
            throw new ApiException(
                Response::HTTP_INTERNAL_SERVER_ERROR,
                1500,
                "Le fichier de configuration du module $this->name est vide."
            );
        }

        $processor = new Processor();
        $config = $processor->processConfiguration($this, ['module' => $config]);

        if (!isset($config['name']) || ($config['name'] != $this->name)) {
            throw new ApiException(
                Response::HTTP_INTERNAL_SERVER_ERROR,
                1500,
                "Le nom du module renseigné dans le fichier de configuration doit être identique au nom de classe du module."
            );
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
            'settings' => $config['settings'],
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

    public function trait(bool $remove): void
    {
        $this->handleTrait(static::ENTITY_TRAITS, $remove);
        $this->handleTrait(static::REPOSITORY_TRAITS, $remove);
    }

    /**
     * Inject or remove trait in entity.
     *
     * @param bool $remove
     *
     * @return void
     * @throws ApiException
     * @throws \ReflectionException
     */
    public function handleTrait(array $traits, bool $remove): void
    {
        if (!$traits) {
            return;
        }

        $moduleName = $this->getInfo()['name'];
        $space = "    ";
        $newLineSpace = PHP_EOL . $space;
        $constructorTemplate = 'public function __construct()' . $newLineSpace . '{';
        $mainTemplate = '/*** > Trait ***/';
        $beginTemplate = "/*** > Module: " . $moduleName . " ***/";
        $endTemplate = "/*** < Module: " . $moduleName . " ***/";

        foreach ($traits as $initialClass => $traitsClass) {
            $initialClass = new \ReflectionClass($initialClass);
            $filePath = $initialClass->getFileName();

            $fileManipulator = $this->fm;
            $content = $fileManipulator->getContent($filePath);

            if (!$remove) {
                $pos = $fileManipulator->getPosition($filePath, $mainTemplate) + strlen($mainTemplate);
                $str = $this->getSubContent($content, 0, $pos);

                // Add template and traits of module
                $str .= $newLineSpace . $beginTemplate;
                $str .= $this->addTraitsUse($traitsClass);
                $str .= $newLineSpace . $endTemplate;

                if (str_contains($content, $constructorTemplate)) {
                    $oldPos = $pos;
                    $pos = $fileManipulator->getPosition($filePath, $constructorTemplate) + strlen($constructorTemplate);
                    $str .= $this->getSubContent($content, $oldPos, $pos);

                    // Add template and constructor body of module
                    $str .= $newLineSpace . $space . $beginTemplate;
                    $str .= $this->addTraitsConstructorBody($traitsClass, $constructorTemplate);
                    $str .= $newLineSpace . $space . $endTemplate;
                }

                $str .= $this->getSubContent($content, $pos);
            } else {
                $pos = $fileManipulator->getPosition($filePath, $beginTemplate);
                $str = $this->getSubContent($content, 0, $pos);

                // Ignore traits of module
                $endPos = $fileManipulator->getPosition($filePath, $endTemplate) + strlen($endTemplate) + strlen($newLineSpace);

                $secondPos = $fileManipulator->getPosition($filePath, $beginTemplate, false);
                if ($secondPos !== $pos) {
                    $str .= $this->getSubContent($content, $endPos, $secondPos - strlen($space));
                    // Ignore constructor body of module
                    $endPos = $fileManipulator->getPosition($filePath, $endTemplate, false) + strlen($endTemplate)
                        + strlen($newLineSpace);
                }

                $str .= $this->getSubContent($content, $endPos);
            }

            $fileManipulator->setContent($filePath, $str);
        }
    }

    private function getSubContent($content, $begin, $to = null)
    {
        return substr($content, $begin, null === $to ? $to : $to - $begin);
    }

    private function addTraitsUse(array $traitsClass): string
    {
        $str = '';
        foreach ($traitsClass as $traitClass) {
            $str .= PHP_EOL . "    " . "use \\" . $traitClass . ';';
        }
        return $str;
    }

    private function addTraitsConstructorBody(array $traitsClass, string $constructorTemplate): string
    {
        $str = '';
        foreach ($traitsClass as $traitClass) {
            $filename = (new \ReflectionClass($traitClass))->getFileName();
            $content  = $this->fm->getContent($filename);

            if (str_contains($content, $constructorTemplate)) {
                $pattern = '/public function __construct\(\)' . PHP_EOL . "    " . '{' . '(?<constructorBody>[^}]+)' . PHP_EOL . "    " . '/';
                $err = preg_match($pattern, $content, $matches);
                if ($err === 0 || $err === FALSE) {
                    continue;
                }

                $str .= $matches['constructorBody'];
            }
        }
        return $str;
    }
}
