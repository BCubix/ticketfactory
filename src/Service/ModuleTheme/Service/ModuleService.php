<?php

namespace App\Service\ModuleTheme\Service;

use App\Exception\ApiException;
use App\Service\Db\Db;
use App\Service\ModuleTheme\Config\ModuleConfig;
use App\Utils\System;

use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\Response;

class ModuleService extends ServiceAbstract
{
    protected const PATH = '/themes/Admin/default/config/modules';

    public const ZIP_FILE_CONFIG_NOT_FOUND = "Le dossier du module ne contient pas le fichier de configuration.";
    public const ZIP_ASSETS_FILE_INDEX_NOT_FOUND = "Le dossier assets ne contient pas le fichier index.js.";
    public const ZIP_SRC_FILE_BUNDLE_NOT_FOUND = "Le dossier src ne contient pas le fichier bundle.";

    /**
     * Get all active module by query in database.
     *
     * @return array List of active modules
     */
    public static function getAllActive(): array
    {
        try {
            return Db::getInstance()->query("SELECT * FROM module WHERE active = '1'");
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function checkNode($nodeKey, $nodeValue, $rootName): void
    {
        // Check index.js in assets
        if ($nodeKey === 'assets') {
            if (!isset($nodeValue[0]) || $nodeValue[0] !== 'index.js') {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_ASSETS_FILE_INDEX_NOT_FOUND);
            }
            return;
        }

        // Check file bundle in src
        if ($nodeKey === 'src') {
            if (!isset($nodeValue[0]) || $nodeValue[0] !== $rootName . '.php') {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_SRC_FILE_BUNDLE_NOT_FOUND);
            }
            return;
        }

        // Check files
        if (is_numeric($nodeKey)) {
            // Logo
            if ($nodeValue === "logo.jpg" || $nodeValue === "logo.png") {
                return;
            }

            // Configuration file
            if ($nodeValue !== $rootName . 'Config.php') {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_FILE_CONFIG_NOT_FOUND);
            }
        }
    }

    protected function checkConfig(string $name): void
    {
        $configFilePath = $this->dir . "/$name/{$name}Config.php";
        if (!is_file($configFilePath)) {
            throw new FileNotFoundException("Le fichier de configuration de $name n'existe pas.");
        }

        require_once $configFilePath;

        if (!class_exists($name . 'Config')) {
            throw new \Exception("Le fichier de configuration de $name ne contient pas la classe {$name}Config.");
        }

        $moduleObj = new ($name . 'Config')($this->dir);
        if (get_parent_class($moduleObj) !== ModuleConfig::class) {
            throw new \Exception("La classe {$name}Config doit hériter de la classe " . ModuleConfig::class . ".");
        }
    }

    public function clear(): void
    {
        parent::clear();

        System::exec('php ../bin/console doctrine:schema:update --force');
        System::exec('yarn run encore production');
    }

    /**
     * Call configuration function.
     *
     * @param string $name
     * @param string $functionName Function to call
     *
     * @return void
     * @throws \Exception
     * @throws FileNotFoundException
     */
    public function callConfig(string $name, string $functionName): void
    {
        $configFilePath = $this->dir . "/$name/{$name}Config.php";
        require_once $configFilePath;

        $moduleObj = new ($name . 'Config')($this->dir);

        if (!method_exists($moduleObj, $functionName)) {
            throw new \Exception("La classe {$name}Config ne contient pas la fonction $functionName.");
        }

        $moduleObj->{$functionName}();
    }
}