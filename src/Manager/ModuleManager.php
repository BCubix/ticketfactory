<?php

namespace App\Manager;

use App\Entity\Addon\Module as ModuleEntity;
use App\Entity\Order\DeliveryMode;
use App\Entity\User\Role;
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

        $this->addMigrations($objectName);

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
                    // We set the new status of the module in the database
                    $module->setActive($action == ModuleEntity::ACTION_INSTALL);
                    $this->em->persist($module);
                    $this->em->flush();

                    // We commit transaction only if the function is not called from ThemeManager ; in this case, clearAssets is true
                    if ($clearAssets && $this->em->getConnection()->isTransactionActive()) {
                        $this->em->getConnection()->commit();
                    }

                    // we add the traits to be installed with the module or remove them if we disable the module
                    $this->callConfig($moduleName, "trait", [$action == ModuleEntity::ACTION_DISABLE]);

                    ($action == ModuleEntity::ACTION_INSTALL ? $this->enableHooks($module) : $this->disableHooks($module));

                    // we execute this function to add the configuration to be installed with the module.
                    $this->executeConfiguration($moduleName, $action, $module);

                    break;

                case ModuleEntity::ACTION_UNINSTALL:
                case ModuleEntity::ACTION_UNINSTALL_DELETE:
                    $this->disableHooks($module);

                    // We remove the module from the table in the database
                    $this->em->remove($module);
                    $this->em->flush();
                    $module = null;

                    // We remove traits added by the module
                    $this->callConfig($moduleName, "trait", [true]);

                    // We execute this function to remove the configuration installed with the module.
                    $this->executeConfiguration($moduleName, $action);

                    // We commit transaction only if the function is not called from ThemeManager ; in this case, clearAssets is false
                    if ($clearAssets && $this->em->getConnection()->isTransactionActive()) {
                        $this->em->getConnection()->commit();
                    }

                    // We make a doctrine:migrations:execute --down for all migration files of the module
                    $this->removeMigrations($moduleName);

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

    protected function getMigrationFileNames(string $migrationFolder, string $objectName): array
    {
        // We check if migrations folder exists in the module
        if (!is_dir($migrationFolder)) {
            return [];
        }

        // We open the migrations folder to get file infos
        $folder = new \DirectoryIterator($migrationFolder);
        $files = [];

        // We add files to the list if their name matches
        foreach ($folder as $file) {
            if (preg_match('/^' . preg_quote("Version$objectName", '/') . ".*\.php$/", $file->getFilename())) {
                $files[] = [
                    'filename' => $file->getFilename(),
                    'path' => $file->getPath(),
                ];
            }
        }

        return $files;
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

    public function addMigrations(string $objectName): void
    {
        $migrationDestFolder = $this->sf->get('pathGetter')->getMigrationsDir();

        // we get the list of migration files
        $migrationFiles = $this->getMigrationFileNames($this->getDir() . "/$objectName/config/migrations", $objectName);

        // We sort the files alphabetically (by version)
        usort($migrationFiles, function($a, $b) {
            return (($a["filename"] < $b["filename"]) ? -1 : (($a["filename"] > $b["filename"]) ? 1 : 0));
        });

        // For each file, if it is not in the migration folder, we copy and run it
        foreach ($migrationFiles as $migrationFile) {
            if (is_file($migrationDestFolder . "/" . $migrationFile['filename'])) {
                continue;
            }

            $this->sf->get('file')->copy($migrationFile['path'] . '/' . $migrationFile['filename'], $migrationDestFolder . "/" . $migrationFile["filename"]);
            $this->sf->get('execService')->execMigrationUpdate("DoctrineMigrations\\" . pathinfo($migrationFile['filename'], PATHINFO_FILENAME), true);
        }
    }

    public function removeMigrations(string $objectName): void
    {
        // We get the migration files that were added during install
        $migrationFolder = $this->sf->get('pathGetter')->getMigrationsDir();
        $migrationFiles = $this->getMigrationFileNames($migrationFolder, $objectName);

        //We sort the files in reverse alphabetical order (by version)
        usort($migrationFiles, function($a, $b) {
            return (($a["filename"] > $b["filename"]) ? -1 : (($a["filename"] < $b["filename"]) ? 1 : 0));
        });

        // For each file, we execute a down migration
        foreach ($migrationFiles as $migrationFile) {
            $this->sf->get('execService')->execMigrationUpdate("DoctrineMigrations\\" . pathinfo($migrationFile['filename'], PATHINFO_FILENAME), false);
            $this->sf->get('file')->remove($migrationFile['path'] . '/' . $migrationFile['filename']);
        }
    }

    public function executeConfiguration(string $objectName, int $action, ?ModuleEntity $module = null): void
    {
        $settings = $this->getConfiguration($objectName)['settings'];
        if ($action == ModuleEntity::ACTION_INSTALL) {
            // If there are parameters defined by the module configuration, we add them to the database
            if (isset($settings['parameters'])) {
                $this->addParameters('module', $objectName, $settings["parameters"]);
            }

            // If there are URLs defined by the module configuration, we add them to the database
            if (isset($settings['url'])) {
                $this->addUrl($settings["url"]);
            }

            if (isset($settings['deliveryModes'])) {
                $this->addDeliveryModes($module, $objectName, $settings['deliveryModes']);
            }

            if (isset($settings['roles'])) {
                $this->addRoles($module, $objectName, $settings['roles']);
            }
        } else if ($action == ModuleEntity::ACTION_DISABLE) {
            // If there are URLs defined by the module configuration, we remove them
            if (isset($settings['url'])) {
                $this->removeUrl($settings['url']);
            }

            if (isset($settings['deliveryModes'])) {
                $this->removeDeliveryModes($module, $objectName, $settings['deliveryModes']);
            }
        } else {
            // If there are parameters defined by the module configuration, we remove them
            if (isset($settings["parameters"])) {
                $this->removeParameters('module', $objectName, $settings["parameters"]);
            }

            // If there are URLs defined by the module configuration, we remove them
            if (isset($settings['url'])) {
                $this->removeUrl($settings['url']);
            }

            if (isset($settings['roles'])) {
                $this->removeRoles($module, $objectName);
            }
        }
    }

    public function isModuleActive(string $name): bool
    {
        $module = $this->em->getRepository(ModuleEntity::class)->findOneByNameForAdmin($name);
        if (null === $module) {
            return false;
        }

        return $module->isActive();
    }

    private function addDeliveryModes(?ModuleEntity $module, string $objectName, array $deliveryModes): void
    {
        $module = $module ?? $this->em->getRepository(ModuleEntity::class)->findOneByNameForAdmin($objectName);
        if (null === $module) {
            return;
        }

        foreach ($deliveryModes as $name => $mode) {
            $newDeliveryMode = new DeliveryMode();

            $newDeliveryMode->setName($name);
            $newDeliveryMode->setModule($module);
            $newDeliveryMode->setManager($mode['manager']);
            $newDeliveryMode->setDescription($mode['description']);
            $newDeliveryMode->setActive(true);

            $this->em->persist($newDeliveryMode);
        }

        $this->em->flush();
    }

    private function removeDeliveryModes(?ModuleEntity $module, string $objectName): void
    {
        $module = $module ?? $this->em->getRepository(ModuleEntity::class)->findOneByNameForAdmin($objectName);
        if (null === $module) {
            return;
        }


        foreach ($module->getDeliveryModes() as $mode) {
            $module->removeDeliveryMode($mode);
        }

        $this->em->persist($module);
        $this->em->flush();
    }

    private function addRoles (?ModuleEntity $module, string $objectName, array $roles): void
    {
        $module = $module ?? $this->em->getRepository(ModuleEntity::class)->findOneByNameForAdmin($objectName);
        if (null === $module) {
            return;
        }

        foreach ($roles as $name => $role) {
            $newRole = new Role();

            $newRole->setName($name);
            $newRole->setModule($module);
            $newRole->setLabel($role['label']);
            $newRole->setGroupName($role['groupName']);
            $newRole->setDescription($role['description'] ?? null);

            $this->em->persist($newRole);
        }

        $this->em->flush();
    }

    private function removeRoles(?ModuleEntity $module, string $objectName): void
    {
        $module = $module ?? $this->em->getRepository(ModuleEntity::class)->findOneByNameForAdmin($objectName);
        if (null === $module) {
            return;
        }

        foreach ($module->getRoles() as $role) {
            $module->removeRole($role);
        }

        $this->em->flush();
    }
}
