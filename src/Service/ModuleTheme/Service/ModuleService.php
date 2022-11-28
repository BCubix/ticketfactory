<?php

namespace App\Service\ModuleTheme\Service;

use App\Exception\ApiException;
use App\Service\Db\Db;
use App\Service\ModuleTheme\Config\ModuleConfig;
use App\Utils\System;

use Symfony\Component\HttpFoundation\Response;

class ModuleService extends ServiceAbstract
{
    protected const PATH = '/themes/Admin/default/modules';
    protected const CONFIG_CLASS = ModuleConfig::class;

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

    public function clear(): void
    {
        parent::clear();

        System::exec('php ../bin/console doctrine:schema:update --force');
        System::exec('yarn run encore production');
    }
}