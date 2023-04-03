<?php

namespace App\Service\Addon;

use App\Exception\ApiException;
use App\Service\Exec\ExecService;
use App\Service\File\FileManipulator;
use App\Service\Hook\HookService;

use Composer\Autoload\ClassLoader;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;
use Symfony\Component\HttpFoundation\Response;

class ModuleConfig
{
    protected const NAME = null;
    protected const DISPLAY_NAME = null;
    protected const DESCRIPTION = null;
    protected const AUTHOR = null;
    protected const VERSION = null;

    protected const TRAITS = [];
    protected const HOOKS  = [];

    protected $name;
    protected $displayName;
    protected $description;
    protected $author;
    protected $version;

    protected $path;
    protected $loader;
    protected $hs;

    public function __construct(string $dir, ?HookService $hs)
    {
        if (null === static::NAME) {
            throw new ApiException(Response::HTTP_NOT_IMPLEMENTED, 1501,
                "Veuillez renseigner le nom dans le fichier de configuration du dossier $dir.");
        }
        if (null === static::DISPLAY_NAME) {
            throw new ApiException(Response::HTTP_NOT_IMPLEMENTED, 1501,
                "Veuillez renseigner le nom d'affichage dans le fichier de configuration du dossier $dir.");
        }
        if (null === static::DESCRIPTION) {
            throw new ApiException(Response::HTTP_NOT_IMPLEMENTED, 1501,
                "Veuillez renseigner la description dans le fichier de configuration du dossier $dir.");
        }
        if (null === static::AUTHOR) {
            throw new ApiException(Response::HTTP_NOT_IMPLEMENTED, 1501,
                "Veuillez renseigner le nom de l'author dans le fichier de configuration du dossier $dir.");
        }
        if (null === static::VERSION) {
            throw new ApiException(Response::HTTP_NOT_IMPLEMENTED, 1501,
                "Veuillez renseigner la version dans le fichier de configuration du dossier $dir.");
        }

        $this->name        = static::NAME;
        $this->displayName = static::DISPLAY_NAME;
        $this->description = static::DESCRIPTION;
        $this->author      = static::AUTHOR;
        $this->version     = static::VERSION;

        $this->path   = $dir . '/' . static::NAME;
        $this->loader = new ClassLoader();
        $this->hs     = $hs;
    }

    /**
     * Get information of module
     *
     * @return array
     */
    public function getInfo(): array
    {
        return [
            'name' => $this->name,
            'displayName' => $this->displayName,
            'description' => $this->description,
            'author' => $this->author,
            'version' => $this->version,
            'hooks' => static::HOOKS,
        ];
    }

    /**
     * Installation of database, ...
     *
     * @return void
     * @throws ApiException
     * @throws DirectoryNotFoundException
     * @throws \ReflectionException
     * @throws \Exception
     */
    public function install(): void
    {
        $this->register();
        $this->trait(false);
        $this->hooks(true);
        $this->migrate(true);
    }

    /**
     * Uninstallation of database, ...
     *
     * @return void
     * @throws ApiException
     * @throws \ReflectionException
     * @throws \Exception
     */
    public function uninstall(): void
    {
        $this->disable();
        $this->migrate(false);
    }

    /**
     * Disable
     *
     * @return void
     * @throws \ReflectionException
     */
    public function disable(): void
    {
        $this->hooks(false);
        $this->trait(true);
        $this->unregister();
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
        $prefix = 'TicketFactory\\Module\\' . static::NAME . '\\';

        // Path of src directory of module
        $path = $this->path . '/src';
        if (!is_dir($path)) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le dossier src du module " . static::NAME . " n'existe pas.");
        }

        $this->loader->setPsr4($prefix, $path);
        $this->loader->register();
    }

    /**
     * Unregister namespace for module autoload.
     *
     * @return void
     */
    public final function unregister(): void
    {
        $this->loader->unregister();
    }

    /**
     * Render twig file from module's templates folder
     *
     * @param string $path
     *
     * @return string
     */
    public function renderModule(string $path, array $parameters): string
    {
        $twig = $this->hs->getTwig();
        $path = ('@modules/' . $this->name . '/templates/' . $path);

        return $twig->render($path, $parameters);
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
    private function trait(bool $remove): void
    {
        if (!static::TRAITS)
            return;

        $space = "    ";
        $newLineSpace = PHP_EOL . $space;
        $constructorTemplate = 'public function __construct()' . $newLineSpace . '{';
        $mainTemplate = '/*** > Trait ***/';
        $beginTemplate = "/*** > Module: " . static::NAME . " ***/";
        $endTemplate = "/*** < Module: " . static::NAME . " ***/";

        foreach (static::TRAITS as $entityClass => $traitsClass) {
            $entityClass = new \ReflectionClass($entityClass);
            $filePath = $entityClass->getFileName();

            $file = new FileManipulator($filePath);
            $content = $file->getContent();

            if (!$remove) {
                $pos = $file->getPosition($mainTemplate) + strlen($mainTemplate);
                $str = $this->getSubContent($content, 0, $pos);

                // Add template and traits of module
                $str .= $newLineSpace . $beginTemplate;
                $str .= $this->addTraitsUse($traitsClass);
                $str .= $newLineSpace . $endTemplate;

                if (str_contains($content, $constructorTemplate)) {
                    $oldPos = $pos;
                    $pos = $file->getPosition($constructorTemplate) + strlen($constructorTemplate);
                    $str .= $this->getSubContent($content, $oldPos, $pos);

                    // Add template and constructor body of module
                    $str .= $newLineSpace . $space . $beginTemplate;
                    $str .= $this->addTraitsConstructorBody($traitsClass, $constructorTemplate);
                    $str .= $newLineSpace . $space . $endTemplate;
                }

                $str .= $this->getSubContent($content, $pos);
            } else {
                $pos = $file->getPosition($beginTemplate);
                $str = $this->getSubContent($content, 0, $pos);

                // Ignore traits of module
                $endPos = $file->getPosition($endTemplate) + strlen($endTemplate) + strlen($newLineSpace);

                $secondPos = $file->getPosition($beginTemplate, false);
                if ($secondPos !== $pos) {
                    $str .= $this->getSubContent($content, $endPos, $secondPos);

                    // Ignore constructor body of module
                    $endPos = $file->getPosition($endTemplate, false) + strlen($endTemplate)
                            + strlen($newLineSpace) + strlen($space);
                }

                $str .= $this->getSubContent($content, $endPos);
            }

            $file->setContent($str);
        }
    }

    private function getSubContent($content, $begin, $to = null) {
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
            $content  = (new FileManipulator($filename))->getContent();

            if (str_contains($content, $constructorTemplate)) {
                $pattern = '/public function __construct\(\)' . PHP_EOL . "    " . '{' . '(?<constructorBody>[^}]+)' . PHP_EOL . "    ". '/';
                $err = preg_match($pattern, $content, $matches);
                if ($err === 0 || $err === FALSE) {
                    continue;
                }

                $str .= $matches['constructorBody'];
            }
        }
        return $str;
    }

    /**
     * Register or unregister hooks
     *
     * @param bool $register
     *
     * @return void
     * @throws ApiException
     */
    private function hooks(bool $register): void
    {
        if (!static::HOOKS || null === $this->hs) {
            return;
        }

        foreach (static::HOOKS as $hookName) {
            if ($register) {
                $this->hs->register($hookName, $this);
            } else {
                $this->hs->unregister($hookName, $this);
            }
        }
    }

    /**
     * Update database with migration
     *
     * @param bool $up
     *
     * @return void
     * @throws \Exception
     */
    private function migrate(bool $up): void
    {
        $migrationClassname = 'Version' . $this->name;
        $migrationClass     = "DoctrineMigrations\\" . $migrationClassname;

        if (is_file($this->path . '/config/migrations/' . $migrationClassname.  '.php')) {
            ExecService::execMigrationUpdate($migrationClass, $up);
        }
    }
}
