<?php

namespace App\Service\Module;

use App\Service\Db\Db;
use Composer\Autoload\ClassLoader;

class ModuleConfig
{
    protected const MODULE_NAME = null;
    protected const NAMESPACES = [];
    protected const TABLES = [];
    protected const TRAITS = [];

    protected $loader;

    public function __construct()
    {
        $this->loader = new ClassLoader();
    }

    /**
     * Installation of database, ...
     *
     * @return void
     * @throws \ReflectionException
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
     * Register namespace for module autoload
     *
     * @return void
     */
    public final function register()
    {
        if (!static::NAMESPACES)
            return;

        foreach (static::NAMESPACES as $prefix => $path) {
            $this->loader->setPsr4($prefix, $path);
        }

        $this->loader->register();
    }

    /**
     * Unregister namespace for module autoload
     *
     * @return void
     */
    public final function unregister()
    {
        $this->loader->unregister();
    }

    /**
     * Inject or remove trait in entity
     *
     * @param bool $remove
     * @return void
     * @throws \ReflectionException
     */
    private function trait(bool $remove)
    {
        if (!static::MODULE_NAME || !static::TRAITS)
            return;

        $space = "\n    ";
        $mainTemplate = '/*** > Trait ***/';
        $beginTemplate = "/*** > Module: " . static::MODULE_NAME . " ***/";
        $endTemplate = "/*** < Module: " . static::MODULE_NAME . " ***/";

        foreach (static::TRAITS as $entityClass => $traitsClass) {
            $entityClass = new \ReflectionClass($entityClass);
            $path = $entityClass->getFileName();

            $content = file_get_contents($path);

            if ($remove) {
                $pos = strpos($content, $beginTemplate);
                $str = substr($content, 0, $pos);

                $pos = strpos($content, $endTemplate) + strlen($endTemplate) + strlen($space);
                $str .= substr($content, $pos);
            } else {
                $pos = strpos($content, $mainTemplate) + strlen($mainTemplate);

                $str = substr($content, 0, $pos);
                $str .= $space . $beginTemplate;
                foreach ($traitsClass as $traitClass) {
                    $str .= $space . "use \\" . $traitClass . ';';
                }
                $str .= $space . $endTemplate;
                $str .= substr($content, $pos);
            }

            file_put_contents($path, $str);
        }
    }
}