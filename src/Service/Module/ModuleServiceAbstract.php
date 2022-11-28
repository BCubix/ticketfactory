<?php

namespace App\Service\Module;

use App\Exception\ApiException;
use App\Utils\System;
use App\Utils\Zip;

use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\Response;

abstract class ModuleServiceAbstract
{
    protected const PATH = null;
    protected const CONFIG_CLASS = null;
    protected const CONFIG_PATH = '';

    public const PATH_REQUIRED         = "Veuillez renseigner la constante PATH.";
    public const CONFIG_CLASS_REQUIRED = "Veuillez renseigner la constante CONFIG_CLASS.";

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
     * Unzip the zip which contains extension.
     *
     * @param string $zipName zip's name
     *
     * @return string name of first directory in zip
     * @throws ApiException
     * @throws \Exception
     */
    public function unzip(string $zipName): string
    {
        $zipPath = $this->dir . '/' . $zipName;

        $tree = Zip::getTreeFromZip($zipPath);

        try {
            $this->checkTree($tree);
        } catch (\Exception $e) {
            unlink($zipPath);
            throw $e;
        }

        Zip::unzip($zipPath, $this->dir);

        return array_key_first($tree);
    }

    /**
     * Verify tree, so verify the architecture of zip.
     *
     * @param array $tree
     *
     * @return void
     * @throws ApiException
     */
    private function checkTree(array $tree): void
    {
        if (!$tree) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, Zip::ZIP_EMPTY);
        }

        $rootName = array_key_first($tree);
        // Type of $name : num => is a file, string => is a directory
        if (is_numeric($rootName) || count(array_keys($tree)) !== 1) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, Zip::ZIP_FIRST_DIR_REQUIRED);
        }

        foreach (array_keys($tree[$rootName]) as $nodeKey) {
            $this->checkNode($nodeKey, $tree[$rootName][$nodeKey], $rootName);
        }
    }

    /**
     * Verify node, so verify if the file or the directory corresponds to the architecture.

     * @param int|string   $nodeKey
     * @param string|array $nodeValue
     * @param string       $rootName
     *
     * @return void
     * @throws ApiException
     */
    protected abstract function checkNode($nodeKey, $nodeValue, string $rootName): void;

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

