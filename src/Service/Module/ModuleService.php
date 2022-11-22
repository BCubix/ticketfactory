<?php

namespace App\Service\Module;

use App\Exception\ApiException;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\Response;

class ModuleService extends ModuleServiceAbstract
{
    protected const PATH = '/themes/Admin/default/modules';
    protected const MODULE_SERVICE_NAME = 'module';

    public const ZIP_FILE_CONFIG_NOT_FOUND = "Le dossier du module ne contient pas le fichier de configuration.";
    public const ZIP_ASSETS_FILE_INDEX_NOT_FOUND = "Le dossier assets ne contient pas le fichier index.js.";

    /**
     * Call configuration function of a module.
     *
     * @param string $moduleFolderName Module's name
     * @param string $functionName     Function to call
     *
     * @return void
     * @throws \Exception
     * @throws FileNotFoundException
     */
    public function callConfig(string $moduleFolderName, string $functionName)
    {
        $moduleConfigFilePath = $this->dir . '/' . $moduleFolderName . '/' . $moduleFolderName . 'Config.php';
        if (!is_file($moduleConfigFilePath)) {
            throw new FileNotFoundException("Le fichier de configuration du module $moduleFolderName n'existe pas.");
        }

        require_once $moduleConfigFilePath;

        if (!class_exists($moduleFolderName.'Config')) {
            throw new \Exception("Le fichier de configuration du module $moduleFolderName ne contient pas la classe {$moduleFolderName}Config.");
        }

        $moduleObj = new ($moduleFolderName.'Config')($this->dir);
        if (get_parent_class($moduleObj) !== ModuleConfig::class) {
            throw new \Exception("La classe {$moduleFolderName}Config doit hériter de la classe " . ModuleConfig::class . ".");
        }

        if (method_exists($moduleObj, $functionName)) {
            $moduleObj->{$functionName}();
        }
    }

    protected function checkTree(array $tree)
    {
        // Name of module
        $name = array_key_first($tree);

        foreach (array_keys($tree[$name]) as $key) {
            $child = $tree[$name][$key];

            // Check index.js in assets
            if ($key === 'assets') {
                if (!isset($child[0]) || $child[0] !== 'index.js') {
                    throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_ASSETS_FILE_INDEX_NOT_FOUND);
                }
                continue;
            }

            // Check files
            if (is_numeric($key)) {
                // Logo
                if ($child === "logo.jpg" || $child === "logo.png") {
                    continue;
                }

                // Configuration file
                if ($child !== $name . 'Config.php') {
                    throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_FILE_CONFIG_NOT_FOUND);
                }
            }
        }
    }
}