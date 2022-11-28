<?php

namespace App\Service\ModuleTheme\Config;

use App\Service\Db\Db;
use App\Utils\FileManipulator;

use Composer\Autoload\ClassLoader;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;

class ModuleConfig extends ConfigAbstract
{
    protected const TABLES = [];
    protected const TRAITS = [];

    protected $loader;

    public function __construct(string $projectDir, string $dir)
    {
        parent::__construct($projectDir, $dir);

        $this->loader = new ClassLoader();
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
     * @throws \Exception
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
        // Namespace prefix of module
        $prefix = 'TicketFactory\\Module\\' . static::NAME . '\\';

        // Path of src directory of module
        $path = $this->path . '/src';
        if (!is_dir($path)) {
            throw new DirectoryNotFoundException("Le dossier src du module " . static::NAME . " n'existe pas.");
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
     * @throws \Exception
     */
    private function trait(bool $remove)
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