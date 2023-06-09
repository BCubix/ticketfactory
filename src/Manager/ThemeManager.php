<?php

namespace App\Manager;

use App\Exception\ApiException;
use App\Service\Addon\Theme;

use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Yaml;

class ThemeManager extends AddonManager
{
    public const SERVICE_NAME = 'theme';

    public function getConfiguration(string $objectName): array
    {
        $config = Yaml::parseFile($this->getDir() . '/' . $objectName . '/config/config.yaml');
        if (!$config) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le fichier de configuration du thème $objectName est vide.");
        }

        $processor = new Processor();
        $theme = new Theme();

        return $processor->processConfiguration($theme, ['theme' => $config]);
    }

    public function getImage(string $objectName): array
    {
        $imagePathWithoutExt = $this->getDir() . '/' . $objectName . '/preview';
        $imageUrlWithoutExt = 'themes/' . $objectName . '/preview';

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

        return ['previewUrl' => $ext];
    }

    public function getDir(): string
    {
        return $this->sf->get('pathGetter')->getThemesDir();
    }

    public function active(string $themeName): Theme
    {
        // Ensure the theme to enable is in database
        $theme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($themeName);
        if (null === $theme) {
            $this->install($themeName);

            $theme = new Theme();
            $theme->setName($themeName);

            $this->em->persist($theme);
            $this->em->flush();
        }

        // If the theme is already enabled, nothing to do
        $mainThemeName = $this->mf->get('parameter')->get('main_theme');
        if ($themeName === $mainThemeName) {
            if ($this->em->getConnection()->isTransactionActive()) {
                $this->em->getConnection()->commit();
            }

            return $theme;
        }

        // Apply configs : disable old theme config and enable new theme config
        $themes = [$themeName => Module::ACTION_INSTALL];
        $mainTheme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($mainThemeName);
        if (null !== $mainTheme) {
            $themes = [$mainThemeName => Module::ACTION_DISABLE];
        }

        foreach ($themes as $themeName => $themeAction) {
            $this->applyThemeConfig($themeName, $themeAction);
        }

        // Apply new theme as enabled in parameters and commit transaction
        $this->mf->get('parameter')->set('main_theme', $themeName);
        $this->em->flush();

        if ($this->em->getConnection()->isTransactionActive()) {
            $this->em->getConnection()->commit();
        }

        $this->clear(true);

        return $theme;
    }

    public function delete(string $objectName): void
    {
        $theme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($themeName);
        if (null === $theme) {
            return;
        }

        $mainThemeName = $this->mf->get('parameter')->get('main_theme');
        if ($themeName === $mainThemeName) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Vous ne pouvez pas supprimer le thème actuellement utilisé.');
        }

        $this->em->remove($theme);
        $this->em->flush();

        parent::delete($themeName);
    }

    public function isSSRActive()
    {
        $themeName = $this->mf->get('parameter')->get('main_theme');
        $configuration = $this->getConfiguration($themeName);

        if (array_key_exists("server_side_rendering", $configuration)) {
            $serverSideRendering = ($configuration['server_side_rendering'] == true ? true : false);
        } else {
            $serverSideRendering = false;
        }

        return $serverSideRendering;
    }

    public function getAdminTemplatesPath(): string
    {
        $themePath = $this->mf->get('parameter')->get('admin_theme');

        return ('Admin/' . $themePath . '/templates/');
    }

    public function getWebsiteTemplatesPath(): string
    {
        $themePath = $this->mf->get('parameter')->get('main_theme');

        return ('Website/' . $themePath . '/templates/');
    }

    protected function applyThemeConfig($themeName, $themeAction): void
    {
        $config = $this->getConfiguration($themeName);
        $settings = $config['settings'];

        // Disable active module
        $modules = $settings['modules'];
        $this->applyModulesConfig($modules['to_disable'], Module::ACTION_DISABLE);
        if ($themeAction == Module::ACTION_INSTALL) {
            $this->applyModulesConfig($modules['to_enable'], Module::ACTION_INSTALL);
        }

        // Disable imageFormat of theme
        $imagesTypes = $settings['images_types'];
        $this->applyImagesTypesConfig($imagesTypes, ($themeAction == Module::ACTION_INSTALL));

        // Disable module register to hook
        $hooks = $settings['hooks']['modules_to_hook'];
        $this->applyHooksConfig($hooks, ($themeAction == Module::ACTION_INSTALL));
    }

    protected function applyModulesConfig(array $modulesName, int $action): void
    {
        foreach ($modulesName as $moduleName) {
            $this->mf->get('module')->active($moduleName, $action, false);
        }
    }

    protected function applyImagesTypesConfig(array $imagesTypes, bool $activeStatus): void
    {
        foreach ($imagesTypes as $name => $format) {
            $imageFormat = $this->em->getRepository(ImageFormat::class)->findOneByNameForAdmin($name);

            if ($activeStatus) {
                if (!$imageFormat) {
                    $imageFormat = new ImageFormat();
                    $imageFormat->setName($name);
                }

                $imageFormat->setHeight($format['height']);
                $imageFormat->setWidth($format['width']);
            }
            $imageFormat->setThemeUse($activeStatus);

            $this->em->persist($imageFormat);
        }

        $this->em->flush();
    }

    protected function applyHooksConfig(array $modulesToHook, bool $registerStatus): void
    {
        foreach ($modulesToHook as $hookName => $modulesName) {
            $position = 0;

            foreach ($modulesName as $moduleName) {
                $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
                // We skip if the module doesn't exist
                if (null === $module) {
                    continue;
                }

                // We skip if the hook's registration status is already the seeked one
                $hook = $this->em->getRepository(Hook::class)->findOneByNameAndModuleNameForAdmin($hookName, $moduleName);
                if (null !== $hook && $registerStatus || null === $hook && !$registerStatus) {
                    continue;
                }

                $moduleInstance = $this->mf->get('module')->getModuleInstance($moduleName);
                if (null === $moduleInstance) {
                    continue;
                }

                $hm = $this->mf->get('hook');
                if ($registerStatus) {
                    $hm->register($hookName, $moduleInstance, $position++);
                } else {
                    $hm->unregister($hookName, $moduleInstance);
                }
            }
        }
    }
}
