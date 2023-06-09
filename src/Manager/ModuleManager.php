<?php

namespace App\Manager;

use App\Entity\Addon\Module as ModuleEntity;
use App\Exception\ApiException;
use App\Service\Addon\Module;

use Symfony\Component\Config\Definition\Processor;
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
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le fichier de configuration du module $objectName est vide.");
        }

        $processor = new Processor();
        $module = new Module();

        return $processor->processConfiguration($module, ['module' => $config]);
    }

    public function getImage(string $objectName): array
    {
        $imagePathWithoutExt = $this->getDir() . '/' . $objectName . '/logo';
        $imageUrlWithoutExt = 'modules/' . $objectName . '/logo';

        $ext = null;
        if (is_file($imagePathWithoutExt . '.png')) {
            $ext = 'png';
        } else if (is_file($imagePathWithoutExt . '.jpg')) {
            $ext = 'jpg';
        }

        if (null !== $ext) {
            $sourceFile = $imagePathWithoutExt . $ext;
            $targetFile = $this->sf->get('pathGetter')->getPublicDir() . '/' . $sourceFile;
            $this->sf->get('file')->copy($sourceFile, $targetFile);

            $ext = ('/' . $sourceFile);
        }

        return ['logoUrl' => $ext];
    }

    public function getDir(): string
    {
        return $this->sf->get('pathGetter')->getModulesDir();
    }

    public function getAll(array $filters = []): array
    {
        $filters['page'] = isset($filters['page']) ? $filters['page'] : 0;
        $filters['active'] = isset($filters['active']) ? $filters['active'] : 0;
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
            if (isset($dbModules[$diskModule['name']])) {
                $active = $dbModules[$diskModule['name']]->isActive();
            }

            $results[] = [
                ...$diskModule,
                'active' => $active
            ];
        }

        return ['results' => $results, 'total' => count($results)];
    }

    public function install(string $objectName): array
    {
        $result = parent::install($objectName);

        $originFile = $this->getDir() . "/$objectName/config/migrations/Version$objectName.php";
        if (is_file($originFile)) {
            $this->fs->copy($originFile, $this->getMigrationFile($objectName));
        }

        return $result;
    }

    public function active(string $moduleName, int $action, bool $clearAssets = true): ?Module
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
                    $this->enableHooks($module);

                    $module->setActive($action == ModuleEntity::ACTION_INSTALL);

                    $this->em->persist($module);
                    $this->em->flush();

                    // We commit transaction only if the function is not called from ThemeManager ; in this case, clearAssets is false
                    if (!$clearAssets && $this->em->getConnection()->isTransactionActive()) {
                        $this->em->getConnection()->commit();
                    }
                    
                    break;

                case ModuleEntity::ACTION_UNINSTALL:
                case ModuleEntity::ACTION_UNINSTALL_DELETE:
                    $this->disableHooks($module);

                    $this->em->remove($module);
                    $this->em->flush();

                    // We commit transaction only if the function is not called from ThemeManager ; in this case, clearAssets is false
                    if (!$clearAssets && $this->em->getConnection()->isTransactionActive()) {
                        $this->em->getConnection()->commit();
                    }

                    if ($action === ModuleEntity::ACTION_INSTALL) {
                        $this->delete($moduleName);
                    }
                    
                    break;

                default:
                    break;
            }

            $this->clear($clearAssets);
        }

        return $module;
    }

    public function delete(string $objectName): void
    {
        $migrationFile = $this->getMigrationFile($objectName);
        if (is_file($migrationFile)) {
            $this->sf->get('file')->remove($migrationFile);
        }

        parent::delete($themeName);
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

    protected function getMigrationFile(string $objectName): string
    {
        $migrationFile = 'Version' . $objectName . '.php';
        $migrationFile = $this->sf->get('pathGetter')->getMigrationsDir(). '/' . $migrationFile;

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
        foreach($newHooks['hooks'] as $hookName => $hookClass) {
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
}
