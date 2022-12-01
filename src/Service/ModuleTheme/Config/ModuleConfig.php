<?php

namespace App\Service\ModuleTheme\Config;

use App\Exception\ApiException;
use App\Service\Db\Db;
use App\Utils\FileManipulator;

use Composer\Autoload\ClassLoader;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;
use Symfony\Component\HttpFoundation\Response;

class ModuleConfig
{
    protected const NAME = null;
    protected const TABLES = [];
    protected const TRAITS = [];

    protected $path;
    protected $loader;

    public function __construct(string $dir)
    {
        if (null === static::NAME) {
            throw new ApiException(Response::HTTP_NOT_IMPLEMENTED, 1501,
                "Veuillez renseigner le nom dans le fichier de configuration du dossier $dir.");
        }

        $this->path = $dir . '/' . static::NAME;
        $this->loader = new ClassLoader();
    }

    /**
     * Installation of database, ...
     *
     * @return void
     * @throws ApiException
     * @throws \ReflectionException
     * @throws DirectoryNotFoundException
     */
    public function install(): void
    {
        $this->register();
        $this->trait(false);
    }

    /**
     * Uninstallation of database, ...
     *
     * @return void
     * @throws \ReflectionException
     * @throws ApiException
     */
    public function uninstall(): void
    {
        $this->disable();

        foreach (static::TABLES as $table) {
            Db::getInstance()->query("DROP TABLE ${table};");
        }
    }

    /**
     * Disable
     *
     * @return void
     * @throws \ReflectionException
     */
    public function disable(): void
    {
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

        $space = PHP_EOL . "    ";
        $mainTemplate = '/*** > Trait ***/';
        $beginTemplate = "/*** > Module: " . static::NAME . " ***/";
        $endTemplate = "/*** < Module: " . static::NAME . " ***/";

        foreach (static::TRAITS as $entityClass => $traitsClass) {
            $entityClass = new \ReflectionClass($entityClass);
            $filePath = $entityClass->getFileName();

            $file = new FileManipulator($filePath);
            $content = $file->getContent();

            if (!$remove) {
                // Find the main template
                $pos = $file->getPosition($mainTemplate) + strlen($mainTemplate);
                $str = substr($content, 0, $pos);

                // Add template and traits of module
                $str .= $space . $beginTemplate;
                foreach ($traitsClass as $traitClass) {
                    $str .= $space . "use \\" . $traitClass . ';';
                }
                $str .= $space . $endTemplate;

                // Add the rest of content
                $str .= substr($content, $pos);
            } else {
                // Find the beginning template of module
                $pos = $file->getPosition($beginTemplate);
                $str = substr($content, 0, $pos);

                // Ignore traits of the module in file and restart at the end of template
                $pos = $file->getPosition($endTemplate) + strlen($endTemplate) + strlen($space);
                $str .= substr($content, $pos);
            }

            $file->setContent($str);
        }
    }
}