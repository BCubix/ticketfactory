<?php

namespace App\Manager;

use App\Entity\Parameter\Parameter;
use Symfony\Component\HttpFoundation\Response;
use App\Exception\ApiException;

abstract class AddonManager extends AbstractManager
{
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
     * Get image and copy it in public directory.
     *
     * @param string $objectName
     *
     * @return array
     */
    public abstract function getImage(string $objectName): array;

    /**
     * Return the path to the main directory where modules / themes are stored.
     *
     * @return string
     */
    public abstract function getDir(): string;

    /**
     * Unzip the zip which contains addons.
     *
     * @param string $zipName
     *
     * @return array names of addons installed
     * @throws \Exception
     */
    public function unzip(string $zipName): array
    {
        $zipPath = $this->getDir() . '/' . $zipName;

        // Create a temporary directory to check zip content
        $tmpDirPath = $this->getDir() . '/tmp' . basename($zipName, '.zip');
        $this->sf->get('file')->mkdir($tmpDirPath);
        $this->sf->get('zip')->unzip($zipPath, $tmpDirPath, false);

        // Separate modules and themes
        $names = [
            'module' => [],
            'theme' => []
        ];
        $addOnPaths = [
            'module' => $this->sf->get('pathGetter')->getModulesDir(),
            'theme' => $this->sf->get('pathGetter')->getThemesDir()
        ];

        try {
            // Iterate over archive content
            $dir = new \DirectoryIterator($tmpDirPath);
            foreach ($dir as $node) {
                if ($node->isDot()) {
                    continue;
                }

                if ($node->isFile()) {
                    throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Une archive ne peut contenir que des dossiers à sa racine.');
                }

                // The addon's directory must contain a valid config file
                if ($node->isDir()) {
                    $name = $node->getBasename();

                    $tree = [$name => $this->sf->get('tree')->build($node->getPathname())];
                    if (!$tree) {
                        throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'L\'archive est vide.');
                    }

                    // Add the addon in the list to install among its type
                    $this->checkConfigFile($tree, $name);
                    $config = $this->mf->get("module")->getConfiguration('/tmp' . basename($zipName, '.zip') . "/" . $name);
                    if (isset($config['type']) && in_array($config['type'], array_keys($names))) {
                        $names[$config['type']][] = $name;
                    }
                }
            }

            foreach ($addOnPaths as $addOntype => $addOnPath) {
                foreach ($names[$addOntype] as $name) {
                    $originDir = $tmpDirPath . '/' . $name;
                    $targetDir = $addOnPath . '/' . $name;

                    // If the module already exists on filesystem, we skip it
                    if (is_dir($targetDir)) {
                        continue;
                    }

                    // We copy the addon in destination folder
                    $this->sf->get('file')->mirror($originDir, $targetDir);

                    try {
                        $this->install($name);
                    } catch (\Exception $e) {
                        $this->delete($name);
                    }
                }
            }
        } finally {
            // Remove temporary folder
            $this->sf->get('file')->remove($tmpDirPath);
        }

        return $names;
    }

    /**
     * Return list of objects optionaly filtered with configuration info.
     *
     * @param array $filters
     *
     * @return array
     * @throws \Exception
     */
    public function getAll(array $filters = []): array
    {
        $results = [];

        $paths = glob($this->getDir() . '/*', GLOB_ONLYDIR);
        foreach ($paths as $path) {
            $objectName = basename($path);
            $object = array_merge($this->getConfiguration($objectName), $this->getImage($objectName));

            if (isset($object['display_name'])) {
                $object['displayName'] = $object['display_name'];
                unset($object['display_name']);
            }

            if (isset($object['settings'])) {
                unset($object['settings']);
            }

            $results[] = $object;
        }

        return $results;
    }

    /**
     * Installs the addon
     *
     * @param string $objectName
     *
     * @return void
     * @throws \Exception
     */
    public function install(string $objectName): array
    {
        return [];
    }

    /**
     * Delete the directory of the addon.
     *
     * @param string $objectName
     *
     * @return void
     * @throws \Exception
     */
    public function delete(string $objectName): void
    {
        $path = $this->getDir() . '/' . $objectName;
        if (!is_dir($path)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $path n'existe pas.");
        }

        $this->fs->remove($path);
    }

    /**
     * Clear cache and refresh project.
     *
     * @param bool $clearAssets
     * 
     * @return void
     * @throws \Exception
     */
    public function clear($clearAssets = true): void
    {
        $this->sf->get('execService')->execClearCache();

        if ($clearAssets) {
            $this->sf->get('execService')->execEncore();
        }
    }

    /**
     * Checks the config file exists.
     *
     * @param string $objectName
     *
     * @return array
     * @throws \Exception
     */
    protected function checkConfigFile(array $tree, string $rootName): void
    {
        $configFound = false;
        if (isset($tree[$rootName]['config'])) {
            foreach ($tree[$rootName]['config'] as $file) {
                if ($file === "config.yaml") {
                    $configFound = true;
                    break;
                }
            }
        }

        if (!$configFound) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Le fichier de configuration du thème n\'existe pas.');
        }
    }

    protected function addParameters(string $moduleName, ?array $parameters): void
    {
        if (null === $parameters || count($parameters) === 0) {
            return;
        }

        foreach ($parameters as $key => $parameter) {
            $parameterKey = $moduleName . '_' . $key;

            if (null === $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin($parameterKey)) {
                $newParameter = new Parameter();
                $newParameter->setName($parameter['displayName']);
                $newParameter->setType($parameter['type']);
                $newParameter->setParamKey($parameterKey);
                $newParameter->setParamValue($parameter['defaultValue']);
                $newParameter->setTabName($parameter['tabName']);
                $newParameter->setBlockName($parameter['blockName']);
                $newParameter->setBreakpointsValue($parameter['breakpointValue']);

                if (isset($parameter['availableValue'])) {
                    $availableValue = [];

                    foreach ($parameter['availableValue'] as $k => $avValue) {
                        $availableValue[] = [
                            'id'    => $k,
                            'name'  => $avValue,
                        ];
                    }

                    $newParameter->setAvailableValue($availableValue);
                }

                $this->em->persist($newParameter);
            }
        }

        $this->em->flush();
    }

    protected function removeParameters(string $objectName, array $parameters): void
    {
        foreach ($parameters as $key => $parameter) {
            $storedParameter = $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin($objectName . '_' . $key);

            if (null !== $storedParameter) {
                $this->em->remove($storedParameter);
            }
        }

        $this->em->flush();
    }
}
