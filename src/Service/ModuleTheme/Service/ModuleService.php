<?php

namespace App\Service\ModuleTheme\Service;

use App\Exception\ApiException;
use App\Service\Db\Db;
use App\Service\ModuleTheme\Config\ModuleConfig;

use Symfony\Component\HttpFoundation\Response;

class ModuleService extends ServiceAbstract
{
    protected const PATH = '/themes/Admin/default/config/modules';

    public const ZIP_FILES_OR_DIRS_NOT_CORRESPONDED = "Le zip contient des fichiers ou dossiers qui ne correspondent pas à l'architecture d'un thème";
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

    /**
     * Call configuration function.
     *
     * @param string $name
     * @param string $functionName Function to call
     *
     * @return void
     * @throws ApiException
     */
    public function callConfig(string $name, string $functionName): void
    {
        $configFilePath = $this->dir . "/$name/{$name}Config.php";
        if (!is_file($configFilePath)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
                "Le fichier de configuration de $name n'existe pas.");
        }

        require_once $configFilePath;

        if (!class_exists($name . 'Config')) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le fichier de configuration de $name doit contenir la classe {$name}Config.");
        }

        $moduleObj = new ($name . 'Config')($this->dir);
        if (get_parent_class($moduleObj) !== ModuleConfig::class) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "La classe {$name}Config doit hériter de la classe " . ModuleConfig::class . ".");
        }

        if (!method_exists($moduleObj, $functionName)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
                "La classe {$name}Config ne contient pas la fonction $functionName.");
        }

        $moduleObj->{$functionName}();
    }

    protected function checkNode(int|string $nodeKey, string|array $nodeValue, string $rootName): void
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

        if ($nodeKey === 'config') {
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

            return;
        }

        throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
            static::ZIP_FILES_OR_DIRS_NOT_CORRESPONDED . ' : ' . (is_numeric($nodeKey) ? $nodeValue : $nodeKey));
    }
}