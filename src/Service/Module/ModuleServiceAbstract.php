<?php

namespace App\Service\Module;

use App\Exception\ApiException;
use App\Utils\System;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\Response;

abstract class ModuleServiceAbstract
{
    protected const PATH = null;
    protected const CONFIG_CLASS = null;
    protected const CONFIG_PATH = '';

    public const PATH_REQUIRED           = "Veuillez renseigner la constante PATH.";
    public const CONFIG_CLASS_REQUIRED   = "Veuillez renseigner la constante CONFIG_CLASS.";

    public const ZIP_FAIL_OPEN           = "L'ouverture du zip a échoué.";
    public const ZIP_FAIL_EXTRACT        = "L'extraction du zip a échoué.";
    public const ZIP_EMPTY               = "Le zip est vide.";
    public const ZIP_MUST_ONLY_ONE_DIR   = "Le zip doit contenir un et uniquement un seul dossier à la racine du zip.";
    public const ZIP_FIRST_DIR_NOT_FOUND = "Le zip doit contenir un dossier.";

    protected $projectDir;
    protected $dir;

    /**
     * @throws \Exception
     */
    public function __construct(string $projectDir)
    {
        if (null === static::PATH) {
            throw new \Exception(static::PATH_REQUIRED);
        }
        if (null === static::CONFIG_CLASS) {
            throw new \Exception(static::CONFIG_CLASS_REQUIRED);
        }

        $this->projectDir = $projectDir;
        $this->dir = $projectDir . static::PATH;
    }

    public function getDir(): string
    {
        return $this->dir;
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
        $configFilePath = $this->dir . "/$name" . static::CONFIG_PATH . "/{$name}Config.php";
        if (!is_file($configFilePath)) {
            throw new FileNotFoundException("Le fichier de configuration de $name n'existe pas.");
        }

        require_once $configFilePath;

        if (!class_exists($name . 'Config')) {
            throw new \Exception("Le fichier de configuration de $name ne contient pas la classe {$name}Config.");
        }

        $moduleObj = new ($name . 'Config')($this->projectDir, $this->dir);
        if (get_parent_class($moduleObj) !== static::CONFIG_CLASS) {
            throw new \Exception("La classe {$name}Config doit hériter de la classe " . static::CONFIG_CLASS . ".");
        }

        if (method_exists($moduleObj, $functionName)) {
            $moduleObj->{$functionName}();
        }
    }

    /**
     * Unzip the zip which contains extension
     *
     * @param string $zipName zip's name of extension
     * @return string name of extension
     * @throws ApiException
     */
    public function unzip(string $zipName): string
    {
        $zip = new \ZipArchive();

        $zipPath = $this->dir . '/' . $zipName;

        $errOpenZip = $zip->open($zipPath);
        unlink($zipPath);

        if (TRUE !== $errOpenZip) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_FAIL_OPEN);
        }

        if ($zip->numFiles === 0) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_EMPTY);
        }

        $name = $zip->getNameIndex(0);

        // Zip have to contain main directory in architecture
        $modulePath = $this->dir . '/' . $name;
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

        if (TRUE !== $zip->extractTo($this->dir)) {
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
    protected abstract function checkTree(array $tree): void;

    /**
     * Clear cache...
     *
     * @return void
     * @throws \Exception
     */
    public function clear(): void
    {
        System::exec('php ../bin/console cache:clear');
    }
}

