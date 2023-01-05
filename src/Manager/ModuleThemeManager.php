<?php

namespace App\Manager;

use App\Exception\ApiException;
use App\Service\Exec\ExecService;
use App\Utils\PathGetter;
use App\Utils\Tree;
use App\Utils\Zip;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;

abstract class ModuleThemeManager extends AbstractManager
{
    protected $dir;
    protected $pg;
    protected $fs;

    public function __construct(EntityManagerInterface $em, PathGetter $pg, Filesystem $fs)
    {
        parent::__construct($em);
        $this->pg = $pg;
        $this->fs = $fs;
    }

    public function getAll(array $filters = []): array
    {
        return $this->getAllInDisk();
    }

    public function getAllInDisk(): array
    {
        $result = [];

        $paths = glob($this->dir . '/*', GLOB_ONLYDIR);
        foreach ($paths as $path) {
            $objectName = basename($path);
            // The next + is used to concat the two arrays
            $result[] = $this->getConfiguration($objectName) + $this->getImage($objectName);
        }

        return $result;
    }

    public abstract function getConfiguration(string $objectName): array;
    public abstract function getImage(string $objectName): array;

    public function unzip(string $zipName): string
    {
        $zipPath = $this->dir . '/' . $zipName;

        // Create tmp directory to unzip the zip
        $tmpDirPath = $this->dir . '/tmp' . basename($zipName, '.zip');
        $this->fs->mkdir($tmpDirPath);
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
            $this->fs->remove($tmpDirPath);
        }

        // Finally unzip the real zip in dir
        if (is_dir($this->dir . '/' . $name)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Le module/thème $name existe déjà.");
        }

        Zip::unzip($zipPath, $this->dir);

        try {
            $this->install($name);
        } catch (\Exception $e) {
            $this->deleteInDisk($name);
            throw $e;
        }

        return $name;
    }

    public function install(string $objectName): array
    {
        return $this->check($objectName);
    }

    public function check(string $objectName): array
    {
        $path = $this->dir . '/' . $objectName;
        if (!is_dir($path)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $path n'existe pas.");
        }

        $tree = [ $objectName => Tree::build($path) ];
        $this->checkTree($tree);

        return $tree;
    }

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

    protected abstract function checkNode(int|string $nodeKey, string|array $nodeValue, string $rootName);

    public function deleteInDisk(string $objectName): void
    {
        $path = $this->dir . '/' . $objectName;
        if (!is_dir($path)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $path n'existe pas.");
        }

        $this->fs->remove($this->dir . '/' . $objectName);
    }

    public function clear(): void
    {
        ExecService::execClearCache();
    }
}