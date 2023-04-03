<?php

namespace App\Manager;

use App\Exception\ApiException;
use App\Service\ServiceFactory;
use App\Service\Archive\Zip;
use App\Service\Exec\ExecService;
use App\Service\File\Tree;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;

abstract class ModuleThemeManager extends AbstractManager
{
    protected $fs;

    public function __construct(
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        Filesystem $fs
    ) {
        parent::__construct($mf, $sf, $em, $rs);

        $this->fs = $fs;
    }

    /**
     * Return the information of object from the config.
     *
     * @param string $objectName
     *
     * @return array
     * @throws \Exception
     */
    public abstract function getConfiguration(string $objectName): array;

    /**
     * Get image and copy in public directory.
     *
     * @param string $objectName
     *
     * @return array
     */
    public abstract function getImage(string $objectName): array;

    /**
     * Return the path to the main directory where modules / themes are stored.
     *
     * @param string $objectName
     *
     * @return array
     */
    public abstract function getDir(): string;

    /**
     * Verify node, so verify if the file or the directory corresponds to the architecture.
     *
     * @param int|string $nodeKey
     * @param string|array $nodeValue
     * @param string $rootName
     *
     * @return void
     * @throws \Exception
     */
    protected abstract function checkNode(int|string $nodeKey, string|array $nodeValue, string $rootName): void;

    /**
     * Return list of objects with configuration info.
     *
     * @param array $filters
     *
     * @return array
     * @throws \Exception
     */
    public function getAll(array $filters = []): array
    {
        return $this->getAllInDisk();
    }

    /**
     * Return list of objects with configuration info.
     *
     * @return array
     * @throws \Exception
     */
    public function getAllInDisk(): array
    {
        $result = [];

        $paths = glob($this->getDir() . '/*', GLOB_ONLYDIR);
        foreach ($paths as $path) {
            $objectName = basename($path);
            // The next + is used to concat the two arrays
            $result[] = $this->getConfiguration($objectName) + $this->getImage($objectName);
        }

        return $result;
    }

    /**
     * Unzip the zip which contains a module or theme.
     *
     * @param string $zipName
     *
     * @return string name of first directory in zip / name of object
     * @throws \Exception
     */
    public function unzip(string $zipName): string
    {
        $zipPath = $this->getDir() . '/' . $zipName;

        // Create tmp directory to unzip the zip
        $tmpDirPath = $this->getDir() . '/tmp' . basename($zipName, '.zip');
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
        if (is_dir($this->getDir() . '/' . $name)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Le module/thème $name existe déjà.");
        }

        Zip::unzip($zipPath, $this->getDir());

        try {
            $this->install($name);
        } catch (\Exception $e) {
            $this->deleteInDisk($name);
            throw $e;
        }

        return $name;
    }

    /**
     * Install : check the architecture, ...
     *
     * @param string $objectName
     *
     * @return array
     * @throws \Exception
     */
    public function install(string $objectName): array
    {
        return $this->check($objectName);
    }

    /**
     * Check the architecture.
     *
     * @param string $objectName
     *
     * @return array
     * @throws \Exception
     */
    public function check(string $objectName): array
    {
        $path = $this->getDir() . '/' . $objectName;
        if (!is_dir($path)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $path n'existe pas.");
        }

        $tree = [$objectName => Tree::build($path)];
        $this->checkTree($tree);

        return $tree;
    }

    /**
     * Verify tree, so verify the architecture of zip.
     *
     * @param array $tree
     *
     * @return void
     * @throws \Exception
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
     * Delete the directory of object (module or theme) and other files configurations.
     *
     * @param string $objectName
     *
     * @return void
     * @throws \Exception
     */
    public function deleteInDisk(string $objectName): void
    {
        $path = $this->getDir() . '/' . $objectName;
        if (!is_dir($path)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $path n'existe pas.");
        }

        $this->fs->remove($this->getDir() . '/' . $objectName);
    }

    /**
     * Clear cache and update project.
     *
     * @return void
     * @throws \Exception
     */
    public function clear(): void
    {
        ExecService::execClearCache();
    }
}
