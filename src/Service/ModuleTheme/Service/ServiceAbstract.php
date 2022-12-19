<?php

namespace App\Service\ModuleTheme\Service;

use App\Exception\ApiException;
use App\Utils\Exec;
use App\Utils\Tree;
use App\Utils\Zip;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;

abstract class ServiceAbstract
{
    protected const PATH = null;

    public const PATH_REQUIRED = "Veuillez renseigner la constante PATH.";

    protected $projectDir;
    protected $dir;

    public function __construct(string $projectDir)
    {
        if (null === static::PATH) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, static::PATH_REQUIRED);
        }

        $this->projectDir = $projectDir;
        $this->dir = $projectDir . static::PATH;
    }

    public function getDir(): string
    {
        return $this->dir;
    }

    /**
     * Unzip the zip which contains a module or theme.
     *
     * @param string $zipName zip's name
     *
     * @return string name of first directory in zip
     * @throws ApiException
     * @throws ApiException
     */
    public function unzip(string $zipName): string
    {
        $zipPath = $this->dir . '/' . $zipName;

        $fs = new Filesystem();

        // Create tmp directory to unzip the zip
        $tmpDirPath = $this->dir . '/tmp' . basename($zipName, '.zip');
        $fs->mkdir($tmpDirPath);
        Zip::unzip($zipPath, $tmpDirPath, false);

        $name = null;

        try {
            // Check only one directory
            $dir = new \DirectoryIterator($tmpDirPath);
            $dirCount = 0;
            foreach ($dir as $node) {
                if ($node->isDot()) {
                    continue;
                }
                if ($node->isFile()) {
                    throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, Zip::ZIP_FIRST_DIR_REQUIRED);
                }
                if ($node->isDir()) {
                    $name = $node->getBasename();
                    $dirCount++;
                }
            }

            // Only one directory required in zip
            if ($dirCount !== 1) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, Zip::ZIP_FIRST_DIR_REQUIRED);
            }
        } finally {
            // Rm tmp directory
            $fs->remove($tmpDirPath);
        }

        // Finally unzip the real zip in dir
        if (is_dir($this->dir . '/' . $name)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Le thème $name existe déjà.");
        }

        Zip::unzip($zipPath, $this->dir);

        try {
            $this->install($name);
        } catch (\Exception $e) {
            $fs->remove($this->dir . '/' . $name);
            throw $e;
        }

        return $name;
    }

    /**
     * Install : check the architecture, ...
     *
     * @param string $name
     * @param array $tree
     *
     * @return void
     * @throws ApiException
     */
    public function install(string $name, array $tree = []): array
    {
        $path = $this->dir . '/' . $name;
        if (!is_dir($path)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $path n'existe pas.");
        }

        $tree = [ $name => Tree::build($path) ];
        $this->checkTree($tree);

        return $tree;
    }

    /**
     * Verify tree, so verify the architecture of zip.
     *
     * @param array $tree
     *
     * @return void
     * @throws ApiException
     */
    protected function checkTree(array $tree): void
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
    protected abstract function checkNode(int|string $nodeKey, string|array $nodeValue, string $rootName): void;

    /**
     * Clear cache...
     *
     * @return void
     * @throws ApiException
     */
    public function clear(): void
    {
        Exec::exec('php ../bin/console cache:clear');
        Exec::exec('php ../bin/console doctrine:schema:update --force');
    }

    /**
     * Get all in disk
     *
     * @return array
     */
    public function getAllInDisk(): array
    {
        $result = [];

        $paths = glob($this->dir . '/*', GLOB_ONLYDIR);
        foreach ($paths as $path) {
            $name = basename($path);
            // The next + is used to concat the two arrays
            $result[] = $this->getConfig($name) + $this->getImage($name);
        }

        return $result;
    }

    /**
     * Return the information from the config
     *
     * @param string $name
     *
     * @return mixed
     */
    public abstract function getConfig(string $name): array;

    /**
     * Get image and copy in public directory
     *
     * @param string $name
     * @return array
     */
    public abstract function getImage(string $name): array;
}

