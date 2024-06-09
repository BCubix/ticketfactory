<?php

namespace App\Manager;

use App\Entity\Addon\Module as ModuleEntity;
use App\Exception\ApiException;
use App\Service\Addon\Module;

use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\Yaml\Yaml;

class ModuleManager extends AddonManager
{
    public const SERVICE_NAME = 'module';

    public function getConfiguration(string $objectName): array
    {
        $config = Yaml::parseFile($this->getDir() . '/' . $objectName . '/config/config.yaml');
        if (!$config) {
            throw new ApiException(
                Response::HTTP_INTERNAL_SERVER_ERROR,
                1500,
                "Le fichier de configuration du module $objectName est vide."
            );
        }

        $processor = new Processor();
        $module = new Module();

        return $processor->processConfiguration($module, ['module' => $config]);
    }

    public function getImage(string $objectName): ?BinaryFileResponse
    {
        if (file_exists($this->sf->get('pathGetter')->getModulesDir() . '/' . $objectName . "/logo.png")) {
            return new BinaryFileResponse($this->sf->get('pathGetter')->getModulesDir() . '/' . $objectName . "/logo.png");
        }
        return null;
    }

    public function getDir(): string
    {
        return $this->sf->get('pathGetter')->getModulesDir();
    }

    public function getType(): string
    {
        return 'module';
    }

    public function getAll(array $filters = []): array
    {
        $filters['page'] = isset($filters['page']) ? $filters['page'] : 0;
        $filters['active'] = isset($filters['active']) ? boolval($filters['active']) : null;
        $filters['sortField'] = 'name';
        $filters['sortOrder'] = 'ASC';

        $diskModules = parent::getAll($filters);
        $dbModulesTmp = $this->em->getRepository(ModuleEntity::class)->findAllForAdmin($filters);

        $results = [];
        $dbModules = [];

        foreach ($dbModulesTmp['results'] as $dbModuleTmp) {
            $dbModules[$dbModuleTmp->getName()] = $dbModuleTmp;
        }

        foreach ($diskModules as $diskModule) {
            $active = false;
            $id = null;

            if (isset($dbModules[$diskModule['name']])) {
                $active = $dbModules[$diskModule['name']]->isActive();
                $id = $dbModules[$diskModule['name']]->getId();
            }

            if (null === $filters['active'] || $filters['active'] === $active) {
                $results[] = [
                    ...$diskModule,
                    'active' => $active,
                    'id' => $id
                ];
            }
        }


        return ['results' => $results, 'total' => count($results)];
    }

    public function install(string $objectName): array
    {
        $result = parent::install($objectName);

        $originFile = $this->getDir() . "/$objectName/config/migrations/Version$objectName.php";
        if (is_file($originFile)) {
            $this->sf->get("file")->copy($originFile, $this->getMigrationFile($objectName));
        }

        return $result;
    }

    public function active(string $moduleName, int $action, bool $clearAssets = true): ?ModuleEntity
    {
        $module = $this->em->getRepository(ModuleEntity::class)->findOneByNameForAdmin($moduleName);
        $modulePath = $this->getDir() . '/' . $moduleName;

        // If the module folder does not exist, check the entry in database and exit
        if (!is_dir($modulePath)) {
            if (null !== $module) {
                $this->disableHooks($module);

                $this->em->remove($module);
                $this->em->flush();

                if ($this->em->getConnection()->isTransactionActive()) {
                    $this->em->getConnection()->commit();
                }
            }

            return null;
        }

        // The module is not registered in database
        if (null === $module) {
            switch ($action) {
                    // Module must be installed
                case ModuleEntity::ACTION_INSTALL:
                case ModuleEntity::ACTION_DISABLE:
                    $this->install($moduleName);

                    $module = new ModuleEntity();
                    $module->setName($moduleName);

                    break;

                    // Module uninstall, nothing to do
                case ModuleEntity::ACTION_UNINSTALL:
                case ModuleEntity::ACTION_UNINSTALL_DELETE:
                default:
                    break;
            }
        }

        // The module either exists in database or just was created and is not still saved
        if (null !== $module) {
            switch ($action) {
                case ModuleEntity::ACTION_INSTALL:
                case ModuleEntity::ACTION_DISABLE:
                    $module->setActive($action == ModuleEntity::ACTION_INSTALL);

                    $this->em->persist($module);
                    $this->em->flush();

                    $this->callConfig($moduleName, "trait", [$action == ModuleEntity::ACTION_DISABLE]);

                    ($action == ModuleEntity::ACTION_INSTALL ? $this->enableHooks($module) : $this->disableHooks($module));

                    // We commit transaction only if the function is not called from ThemeManager ; in this case, clearAssets is true
                    if ($clearAssets && $this->em->getConnection()->isTransactionActive()) {
                        $this->em->getConnection()->commit();
                    }

                    $settings = $this->getConfiguration($moduleName)['settings'];
                    if ($action == ModuleEntity::ACTION_INSTALL) {
                        if (isset($settings["parameters"])) {
                            $this->addParameters('module', $moduleName, $settings["parameters"]);
                        }

                        if (isset($settings["url"])) {
                            $this->addUrl($settings["url"]);
                        }
                    } else {
                        if (isset($settings['url'])) {
                            $this->removeUrl($settings['url']);
                        }
                    }

                    break;

                case ModuleEntity::ACTION_UNINSTALL:
                case ModuleEntity::ACTION_UNINSTALL_DELETE:
                    $this->disableHooks($module);

                    $this->em->remove($module);
                    $this->em->flush();

                    $this->callConfig($moduleName, "trait", [true]);

                    $settings = $this->getConfiguration($moduleName)['settings'];
                    if (isset($settings["parameters"])) {
                        $this->removeParameters('module', $moduleName, $settings["parameters"]);
                    }

                    if (isset($settings['url'])) {
                        $this->removeUrl($settings['url']);
                    }

                    // We commit transaction only if the function is not called from ThemeManager ; in this case, clearAssets is false
                    if ($clearAssets && $this->em->getConnection()->isTransactionActive()) {
                        $this->em->getConnection()->commit();
                    }

                    if ($action === ModuleEntity::ACTION_UNINSTALL_DELETE) {
                        $this->delete($moduleName);
                    }

                    break;

                default:
                    break;
            }

            $this->clear(false); //$clearAssets);
        }

        return $module;
    }

    public function delete(string $objectName): void
    {
        $migrationFile = $this->getMigrationFile($objectName);
        if (is_file($migrationFile)) {
            $this->sf->get('file')->remove($migrationFile);
        }

        parent::delete($objectName);
    }

    public function getModuleInstance($moduleName): ?Bundle
    {
        foreach ($this->kl->getBundles() as $bundleName => $bundleInstance) {
            if ($moduleName === $bundleName) {
                return $bundleInstance;
            }
        }

        return null;
    }

    public function getModuleFilePath(string $moduleName, string $path): string
    {
        $overrideModulePath = $this->mf->get('parameter')->getCoreParameter('main_theme') . '/module/' . $moduleName . '/templates/' . $path;

        if (file_exists($this->sf->get('pathGetter')->getThemesDir() . '/' .  $overrideModulePath)) {
            $path = 'Website/' . $overrideModulePath;
        } else {
            $path = ('@modules/' . $moduleName . '/templates/' . $path);
        }

        return $path;
    }

    public function importModuleInstance($moduleName): ?Bundle
    {
        $modulesDir = $this->kl->getModulesDir();

        $bundleFilePath = $modulesDir . '/' . $moduleName . '/src/' . $moduleName . '.php';
        if (is_file($bundleFilePath)) {
            require_once $bundleFilePath;
            $bundleFileName = substr(basename($bundleFilePath), 0, -4);
            $moduleNamespace = 'TicketFactory\\Module\\' . $moduleName . '\\' . $bundleFileName;

            $bundle = new $moduleNamespace;
            if (method_exists($bundle, 'register')) {
                $bundle->register();
            }

            return $bundle;
        }

        return null;
    }

    protected function getMigrationFile(string $objectName): string
    {
        $migrationFile = 'Version' . $objectName . '.php';
        $migrationFile = $this->sf->get('pathGetter')->getMigrationsDir() . '/' . $migrationFile;

        return $migrationFile;
    }

    protected function enableHooks(ModuleEntity $module): void
    {
        $existingHooks = [];
        foreach ($module->getHooks() as $existingHook) {
            $existingHooks[] = $existingHook->getName();
        }

        $newHooks = $this->getConfiguration($module->getName());
        if (!isset($newHooks['hooks'])) {
            return;
        }

        $hm = $this->mf->get('hook');
        foreach ($newHooks['hooks'] as $hookName => $hookClass) {
            if (!in_array($hookName, $existingHooks)) {
                $hm->register($hookName, $module, $hookClass);
            }
        }
    }

    protected function disableHooks(ModuleEntity $module): void
    {
        foreach ($module->getHooks() as $hook) {
            $this->em->remove($hook);
        }
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
        $moduleConfig = $this->importModuleInstance($name);

        if (!$moduleConfig) {
            throw new ApiException(
                Response::HTTP_BAD_REQUEST,
                1400,
                "La classe {$name} n'existe pas."
            );
        }

        if (!method_exists($moduleConfig, $functionName)) {
            throw new ApiException(
                Response::HTTP_BAD_REQUEST,
                1400,
                "La classe {$name} ne contient pas la fonction $functionName."
            );
        }

        return $moduleConfig->{$functionName}(...$args);
    }
}
