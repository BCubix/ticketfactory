<?php

namespace App\Service\Module;

use App\Exception\ApiException;
use App\Service\Db\Db;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\Response;

class ModuleService
{
    public const ZIP_FAIL_OPEN = "L'ouverture du zip a échoué.";
    public const ZIP_FAIL_EXTRACT = "L'extraction du zip a échoué.";
    public const ZIP_EMPTY = "Le zip est vide.";
    public const ZIP_MUST_ONLY_ONE_DIR = "Le zip doit contenir un et uniquement un seul dossier à la racine du zip.";
    public const ZIP_FIRST_DIR_NOT_FOUND = "Le zip doit contenir un dossier.";
    public const ZIP_FILE_CONFIG_NOT_FOUND = "Le dossier du module ne contient pas le fichier de configuration.";
    public const ZIP_ASSETS_FILE_INDEX_NOT_FOUND = "Le dossier assets ne contient pas le fichier index.js.";

    private $moduleDir;

    public function __construct(string $projectDir)
    {
        $this->moduleDir = $projectDir . '/modules';
    }

    public function getModuleDir(): string
    {
        return $this->moduleDir;
    }

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
        $moduleConfigFilePath = $this->moduleDir . '/' . $moduleFolderName . '/' . $moduleFolderName . 'Config.php';
        if (!is_file($moduleConfigFilePath)) {
            throw new FileNotFoundException("Le fichier de configuration du module $moduleFolderName n'existe pas.");
        }

        require_once $moduleConfigFilePath;

        if (!class_exists($moduleFolderName.'Config')) {
            throw new \Exception("Le fichier de configuration du module $moduleFolderName ne contient pas la classe {$moduleFolderName}Config.");
        }

        $moduleObj = new ($moduleFolderName.'Config')();
        if (get_parent_class($moduleObj) !== ModuleConfig::class) {
            throw new \Exception("La classe {$moduleFolderName}Config doit hériter de la classe " . ModuleConfig::class . ".");
        }

        if (method_exists($moduleObj, $functionName)) {
            $moduleObj->{$functionName}();
        }
    }

    /**
     * Get all active modules by query in database.
     *
     * @return array List of active modules
     */
    public static function getModulesActive(): array
    {
        try {
            return Db::getInstance()->query("SELECT * FROM module");
        } catch (\Exception $e) {
            return [];
        }
    }


    /**
     * Delete directory recursively.
     *
     * @param string $path
     * @return void
     */
    private function removeDirectory(string $path)
    {
        if (!is_dir($path))
            return;

        $files = glob($path.'/*');
        foreach ($files as $file) {
            is_dir($file) ? $this->removeDirectory($file) : unlink($file);
        }
        rmdir($path);
    }

    /**
     * Delete module folder.
     *
     * @param string $moduleFolderName
     * @return void
     */
    public function deleteModuleFolder(string $moduleFolderName)
    {
        $this->removeDirectory($this->moduleDir . '/' . $moduleFolderName);
    }

    /**
     * Unzip the zip which contains module
     *
     * @param string $zipName zip's name in module
     * @return string name of module
     * @throws ApiException
     */
    public function unzip(string $zipName): string
    {
        $zip = new \ZipArchive;

        $zipPath = $this->moduleDir . '/' . $zipName;
        $resultOpenZip = $zip->open($zipPath);
        unlink($zipPath);

        if (TRUE !== $resultOpenZip) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_FAIL_OPEN);
        }

        if ($zip->numFiles === 0) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_EMPTY);
        }

        // Zip have to contain main directory in architecture
        $modulePath = $this->moduleDir . '/' . $zip->getNameIndex(0);
        if ('/' !== substr($modulePath, -1)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_FIRST_DIR_NOT_FOUND);
        }

        // Get architecture of zip
        $tree = $this->buildTreeFromZip($zip);
        if (count(array_keys($tree)) !== 1) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_MUST_ONLY_ONE_DIR);
        }

        // Check architecture of zip
        $this->checkTree($tree);

        if (TRUE !== $zip->extractTo($this->moduleDir)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_FAIL_EXTRACT);
        }

        $zip->close();

        return array_key_first($tree);
    }

    /**
     * Build tree for the architecture of zip
     *
     * @param \ZipArchive $zip
     * @return array
     * @throws ApiException
     */
    private function buildTreeFromZip(\ZipArchive $zip): array
    {
        $tree = [];

        // Visit all files or directories of zip
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $path = $zip->getNameIndex($i);
            $pathBySlash = array_values(explode('/', rtrim($path, '/')));
            $len = count($pathBySlash);

            // Go to the last array correspond as the last directory of path
            $tmp = &$tree;
            for ($j = 0; $j < $len - 1; $j++) {
                $tmp = &$tmp[$pathBySlash[$j]];
            }

            if (substr($path, -1) == '/') {
                // Add new array if the path is a directory
                $tmp[$pathBySlash[$len - 1]] = [];
            } else {
                // Add in array is the path is a file
                $tmp[] = $pathBySlash[$len - 1];
            }
        }

        return $tree;
    }

    /**
     * Verify tree, so verify the architecture of zip
     *
     * @param array $tree
     * @return void
     * @throws ApiException
     */
    private function checkTree(array $tree)
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