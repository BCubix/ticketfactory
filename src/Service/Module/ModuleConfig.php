<?php

namespace App\Service\Module;

use App\Service\Db\Db;

use Composer\Autoload\ClassLoader;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;

class ModuleConfig
{
    protected const MODULE_NAME = null;
    protected const TABLES = [];
    protected const TRAITS = [];

    protected $loader;
    protected $moduleDir;

    public function __construct(string $moduleDir)
    {
        $this->loader = new ClassLoader();
        $this->moduleDir = $moduleDir;
    }

    /**
     * Installation of database, ...
     *
     * @return void
     * @throws \InvalidArgumentException
     * @throws \ReflectionException
     * @throws DirectoryNotFoundException
     */
    public function install()
    {
        $this->register();
        $this->trait(false);
    }

    /**
     * Uninstallation of database, ...
     *
     * @return void
     * @throws \ReflectionException
     */
    public function uninstall()
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
    public function disable()
    {
        $this->trait(true);
        $this->unregister();
    }

    /**
     * Register namespace for module autoload.
     *
     * @return void
     * @throws \InvalidArgumentException
     * @throws DirectoryNotFoundException
     */
    public final function register()
    {
        if (null === static::MODULE_NAME) {
            throw new \InvalidArgumentException("Le nom du module n'est pas renseigné dans le fichier de configuration.");
        }

        // Namespace prefix of module
        $prefix = 'TicketFactory\\Module\\' . static::MODULE_NAME . '\\';

        // Path of src directory of module
        $path = $this->moduleDir . '/' . static::MODULE_NAME . '/src';
        if (!is_dir($path)) {
            throw new DirectoryNotFoundException("Le dossier src du module " . static::MODULE_NAME . " n'existe pas.");
        }

        $this->loader->setPsr4($prefix, $path);
        $this->loader->register();
    }

    /**
     * Unregister namespace for module autoload.
     *
     * @return void
     */
    public final function unregister()
    {
        $this->loader->unregister();
    }

    /**
     * Inject or remove trait in entity.
     *
     * @param bool $remove
     * @return void
     * @throws \ReflectionException
     */
    private function trait(bool $remove)
    {
        if (!static::MODULE_NAME || !static::TRAITS)
            return;

        $space = PHP_EOL . "    ";
        $mainTemplate = '/*** > Trait ***/';
        $beginTemplate = "/*** > Module: " . static::MODULE_NAME . " ***/";
        $endTemplate = "/*** < Module: " . static::MODULE_NAME . " ***/";

        foreach (static::TRAITS as $entityClass => $traitsClass) {
            $entityClass = new \ReflectionClass($entityClass);
            $path = $entityClass->getFileName();

            $content = file_get_contents($path);

            if (!$remove) {
                // Find the main template
                $pos = strpos($content, $mainTemplate) + strlen($mainTemplate);
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
                $pos = strpos($content, $beginTemplate);
                $str = substr($content, 0, $pos);

                // Ignore traits of the module in file and restart at the end of template
                $pos = strpos($content, $endTemplate) + strlen($endTemplate) + strlen($space);
                $str .= substr($content, $pos);
            }

            file_put_contents($path, $str);
        }
    }
}