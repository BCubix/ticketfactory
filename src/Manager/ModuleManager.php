<?php

namespace App\Manager;

use App\Entity\Module\Module;
use App\Exception\ApiException;
use App\Service\Hook\HookService;
use App\Service\ModuleTheme\Config\ModuleConfig;
use App\Utils\GetClass;
use App\Utils\PathGetter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;

class ModuleManager extends ModuleThemeManager
{
    private const ACTIONS = [
        Module::ACTION_INSTALL          => 'install',
        Module::ACTION_DISABLE          => 'disable',
        Module::ACTION_UNINSTALL        => 'uninstall',
        Module::ACTION_UNINSTALL_DELETE => 'uninstall',
    ];

    public const ZIP_FILES_OR_DIRS_NOT_CORRESPONDED = "Le zip contient des fichiers ou dossiers qui ne correspondent pas à l'architecture d'un thème";
    public const ZIP_FILE_CONFIG_NOT_FOUND = "Le dossier du module ne contient pas le fichier de configuration.";
    public const ZIP_ASSETS_FILE_INDEX_NOT_FOUND = "Le dossier assets ne contient pas le fichier index.js.";
    public const ZIP_SRC_FILE_BUNDLE_NOT_FOUND = "Le dossier src ne contient pas le fichier bundle.";

    private $hs;

    public function __construct(EntityManagerInterface $em, PathGetter $pg, Filesystem $fs, HookService $hs)
    {
        parent::__construct($em, $pg, $fs);

        $this->dir = $this->pg->getModulesDir();

        $this->hs = $hs;
    }

    public function getAll(array $filters = []): array
    {
        $filters['sortField'] = 'name';
        $filters['sortOrder'] = 'ASC';
        $modules = $this->em->getRepository(Module::class)->findAllForAdmin($filters);

        $modulesInDisk = parent::getAll($filters);
        $indexDisk = 0;
        $lenDisk = count($modulesInDisk);

        $results = [];

        $active = isset($filters['active']) && $filters['active'] === '1';

        for ($i = 0; $i < $modules['total']; ++$i, ++$indexDisk) {
            $moduleName = $modules['results'][$i]->getName();

            // If active, skip all module not installed
            while ($indexDisk < $lenDisk && $moduleName !== $modulesInDisk[$indexDisk]['name']) {
                if (!$active) { // Add module no already installed
                    $results[] = [
                        ...$modulesInDisk[$indexDisk],
                        'active' => false,
                    ];
                }
                $indexDisk++;
            }

            if ($indexDisk === $lenDisk) {
                throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module $moduleName n'a pas de dossier enregistré.");
            }

            $results[] = [
                ...$modulesInDisk[$indexDisk],
                'active' => $modules['results'][$i]->isActive()
            ];
        }

        if (!$active) { // Add module no already installed
            for (; $indexDisk < $lenDisk; ++$indexDisk) {
                $results[] = [
                    ...$modulesInDisk[$indexDisk],
                    'active' => false,
                ];
            }
        }

        return ['results' => $results, 'total' => count($results)];
    }

    public function getConfiguration(string $objectName): array
    {
        return $this->callConfig($objectName, 'getInfo');
    }

    public function getImage(string $objectName): array
    {
        $imagePathWithoutExt = $this->dir . "/$objectName/logo";

        $ext = is_file("$imagePathWithoutExt.png") ? 'png' :
              (is_file("$imagePathWithoutExt.jpg") ? 'jpg' : null);

        if (null !== $ext) {
            $imageUrlWithoutExt = "modules/$objectName/logo";

            $originFile = "$imagePathWithoutExt.$ext";
            $targetFile = "{$this->pg->getProjectDir()}public/$imageUrlWithoutExt.$ext";
            $this->fs->copy($originFile, $targetFile);

            $ext = "/$imageUrlWithoutExt.$ext";
        }

        return ['logoUrl' => $ext];
    }

    public function install(string $objectName): array
    {
        $result = parent::install($objectName);

        $originFile = "$this->dir/$objectName/config/migrations/Version$objectName.php";
        if (is_file($originFile)) {
            $targetFile = "{$this->pg->getProjectDir()}migrations/Version$objectName.php";
            $this->fs->copy($originFile, $targetFile);
        }

        return $result;
    }

    protected function checkNode(int|string $nodeKey, string|array $nodeValue, string $rootName): void
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

        if ($nodeKey === 'config') {
            return;
        }

        // Check files
        if (is_numeric($nodeKey)) {
            // Logo
            if ($nodeValue === "logo.jpg" || $nodeValue === "logo.png") {
                return;
            }

            // Configuration file
            if ($nodeValue !== $rootName . 'Config.php' && $nodeValue !== strtolower($rootName) . '.html.twig') {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_FILE_CONFIG_NOT_FOUND);
            }

            return;
        }

        throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
            static::ZIP_FILES_OR_DIRS_NOT_CORRESPONDED . ' : ' . (is_numeric($nodeKey) ? $nodeValue : $nodeKey));
    }

    public function deleteInDisk(string $objectName): void
    {
        parent::deleteInDisk($objectName);

        $this->fs->remove("{$this->pg->getProjectDir()}migrations/Version$objectName.php");
    }

    /**
     * Active module.
     *
     * @param string $moduleName
     * @param int $action
     * @param bool $active
     *
     * @return Module|null
     * @throws \Exception
     */
    public function active(string $moduleName, int $action, bool $active): Module|null
    {
        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);

        $modulePath = $this->dir . '/' . $moduleName;
        if (!is_dir($modulePath)) {
            if (null !== $module) {
                $this->em->remove($module);
                $this->em->flush();
            }
            return null;
        }

        if (null === $module) {
            switch ($action) {
                case Module::ACTION_UNINSTALL_DELETE:
                    $this->deleteInDisk($moduleName);
                    break;
                case Module::ACTION_INSTALL:
                    $this->install($moduleName);

                    $module = new Module();
                    $module->setName($moduleName);
                    break;
                default:
                    break;
            }
        }

        if (null !== $module) {
            if ($action === Module::ACTION_UNINSTALL_DELETE) {
                // Important: Call uninstallation before delete module
                $this->callConfig($moduleName, self::ACTIONS[$action]);

                $this->em->remove($module);
                $this->em->flush();

                $this->deleteInDisk($moduleName);
                $this->clear();
            } else if ($active !== $module->isActive()) { // Ignore if already same active
                $module->setActive($active);

                $this->em->persist($module);
                $this->em->flush();

                // Important: Call config after install module
                $this->callConfig($moduleName, self::ACTIONS[$action]);
                $this->clear();
            }
        }

        return $module;
    }

    /**
     * Call module configuration function.
     *
     * @param string $name
     * @param string $functionName
     * @param array $args
     *
     * @return mixed
     * @throws \Exception
     */
    public function callConfig(string $name, string $functionName, array $args = []): mixed
    {
        $moduleConfig = $this->getModuleConfigInstance($name);

        if (!method_exists($moduleConfig, $functionName)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
                "La classe {$name}Config ne contient pas la fonction $functionName.");
        }

        return $moduleConfig->{$functionName}(...$args);
    }

    /**
     * Get instance of module configuration class.
     *
     * @param string $name
     *
     * @return ModuleConfig
     * @throws \Exception
     */
    public function getModuleConfigInstance(string $name): ModuleConfig
    {
        return GetClass::getClass($this->dir . "/$name/{$name}Config.php",
            $name . 'Config', [$this->dir, $this->hs]);
    }
}