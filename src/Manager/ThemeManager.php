<?php

namespace App\Manager;

use App\Entity\Media\ImageFormat;
use App\Entity\Addon\Module;
use App\Entity\Addon\Theme as ThemeEntity;
use App\Entity\Hook\Hook;
use App\Entity\Parameter\Parameter;
use App\Exception\ApiException;
use App\Service\Addon\Theme;
use App\Service\File\FileManipulator;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Yaml;

class ThemeManager extends AddonManager
{
    public const SERVICE_NAME = 'theme';

    public function getConfiguration(string $objectName): array
    {
        $config = Yaml::parseFile($this->getDir() . '/' . $objectName . '/config/config.yaml');
        if (!$config) {
            throw new ApiException(
                Response::HTTP_INTERNAL_SERVER_ERROR,
                1500,
                "Le fichier de configuration du thème $objectName est vide."
            );
        }

        $processor = new Processor();
        $theme = new Theme();

        return $processor->processConfiguration($theme, ['theme' => $config]);
    }

    public function getDir(): string
    {
        return $this->sf->get('pathGetter')->getThemesDir();
    }

    public function getType(): string
    {
        return 'theme';
    }

    public function getImage(string $objectName): ?BinaryFileResponse
    {
        if (file_exists($this->sf->get('pathGetter')->getThemesDir() . '/' . $objectName . "/preview.jpg")) {
            return new BinaryFileResponse($this->sf->get('pathGetter')->getThemesDir() . '/' . $objectName . "/preview.jpg");
        }
        return null;
    }

    public function active(string $themeName): ThemeEntity
    {
        // Ensure the theme to enable is in database
        $theme = $this->em->getRepository(ThemeEntity::class)->findOneByNameForAdmin($themeName);
        if (null === $theme) {
            $this->install($themeName);

            $theme = new ThemeEntity();
            $theme->setName($themeName);

            $this->em->persist($theme);
            $this->em->flush();
        }

        // If the theme is already enabled, nothing to do
        $mainThemeName = $this->mf->get('parameter')->getCoreParameter('main_theme');
        if ($themeName === $mainThemeName) {
            if ($this->em->getConnection()->isTransactionActive()) {
                $this->em->getConnection()->commit();
            }

            return $theme;
        }

        $settings = $this->getConfiguration($themeName)['settings'];
        if (isset($settings["parameters"])) {
            $this->addParameters('theme', $themeName, $settings["parameters"]);
        }
        
        if (isset($settings["url"])) {
            $this->addUrl($settings["url"]);
        }

        // Apply configs : disable old theme config and enable new theme config
        $themes = [$themeName => Module::ACTION_INSTALL];
        $mainTheme = $this->em->getRepository(ThemeEntity::class)->findOneByNameForAdmin($mainThemeName);
        $themeParameterValues = [];
        if (null !== $mainTheme) {
            $themes = [$mainThemeName => Module::ACTION_DISABLE];

            $settings = $this->getConfiguration($mainThemeName)['settings'];
            if (isset($settings["parameters"])) {
                $themeParameterValues = $this->getThemeParameterValues($settings['parameters'], $mainThemeName);
                $this->removeParameters('theme', $mainThemeName, $settings["parameters"]);

                if (count($themeParameterValues) > 0) {
                    $this->setNewThemeParameters($themeParameterValues, $themeName);
                }
            }

            if (isset($settings['url'])) {
                $this->removeUrl($settings['url']);
            }
        }

        foreach ($themes as $tName => $themeAction) {
            $this->applyThemeConfig($tName, $themeAction);
        }

        // Apply new theme as enabled in parameters and commit transaction
        $this->mf->get('parameter')->set('core_main_theme', $themeName);
        $this->em->flush();

        if ($this->em->getConnection()->isTransactionActive()) {
            $this->em->getConnection()->commit();
        }

        $this->entry($themeName, false);
        $this->clear(true);

        $this->sf->get('logger')->log(0, 0, 'Activated theme.', Theme::class, $theme->getId());

        return $theme;
    }

    public function delete(string $themeName): void
    {
        $theme = $this->em->getRepository(ThemeEntity::class)->findOneByNameForAdmin($themeName);
        if (null === $theme) {
            return;
        }

        $mainThemeName = $this->mf->get('parameter')->getCoreParameter('main_theme');
        if ($themeName === $mainThemeName) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Vous ne pouvez pas supprimer le thème actuellement utilisé.');
        }

        $objectId = $theme->getId();
        $this->em->remove($theme);
        $this->em->flush();

        $this->sf->get('logger')->log(0, 0, 'Deleted theme.', Theme::class, $objectId);

        parent::delete($themeName);
    }

    public function isSSRActive()
    {
        $themeName = $this->mf->get('parameter')->getCoreParameter('main_theme');
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
        $themePath = $this->mf->get('parameter')->getCoreParameter('admin_theme');

        return ('Admin/' . $themePath . '/templates/');
    }

    public function getWebsiteTemplatesPath(): string
    {
        $themePath = $this->mf->get('parameter')->getCoreParameter('main_theme');

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

    /**
     * Inject or remove entry in webpack.
     *
     * @param string $name
     * @param bool   $remove
     *
     * @return void
     * @throws \Exception
     */
    protected function entry(string $name, bool $remove): void
    {
        $webpackFilePath = $this->sf->get('pathGetter')->getProjectDir() . 'webpack.config.js';

        $file = new FileManipulator();
        $content = $file->getContent($webpackFilePath);

        $positionLine = "// <<< Variables";
        $endPositionLine = "// >>> Variables";
        $needleAppEntry = "const adminThemeName = 'default';";
        $needleWebsiteEntry = "const websiteThemeName = '" . $name . "';" . PHP_EOL;

        // Find position of the end of app entry in content
        $position = $file->getPosition($webpackFilePath, $positionLine) + strlen($positionLine);
        // Add content start the beginning content to the end of app entry
        $newContent = substr($content, 0, $position);

        $newContent .= PHP_EOL . $needleAppEntry;
        if (!$remove) {
            // Add website entry
            $newContent .= PHP_EOL . $needleWebsiteEntry;
        } else {
            // Find position of the end of website entry in content
            $newContent .= PHP_EOL . "const websiteThemeName = '';";
        }

        $position = $file->getPosition($webpackFilePath, $endPositionLine);

        // Add rest of content
        $newContent .= substr($content, $position);

        $file->setContent($webpackFilePath, $newContent);
    }

    private function getThemeParameterValues(array $settings, string $themeName): array
    {
        $values = [];

        foreach($settings as $key => $setting) {
            $storedParameter = $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin('theme_' . $themeName . '_' . $key);
            if (null !== $storedParameter) {
                $values[$key] = $storedParameter->getParamValue();
            }
        }

        return $values;
    }

    private function setNewThemeParameters (array $parameterValues, string $newThemeName): void
    {
        foreach($parameterValues as $key => $value) {
            $storedParameter = $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin('theme_' . $newThemeName . '_' . $key);
            if (null !== $storedParameter) {
                $storedParameter->setParamValue($value);
                $this->em->persist($storedParameter);
            }
        }
    }
}
