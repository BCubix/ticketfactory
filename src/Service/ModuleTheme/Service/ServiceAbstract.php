<?php

namespace App\Service\ModuleTheme\Service;

use App\Exception\ApiException;
use App\Utils\System;
use App\Utils\Zip;

use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\Response;

abstract class ServiceAbstract
{
    protected const PATH = null;

    public const PATH_REQUIRED = "Veuillez renseigner la constante PATH.";

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

        $this->projectDir = $projectDir;
        $this->dir = $projectDir . static::PATH;
    }

    public function getDir(): string
    {
        return $this->dir;
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

