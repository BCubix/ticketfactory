<?php

namespace App\Manager;

use App\Entity\Hook\Hook;
use App\Entity\Media\ImageFormat;
use App\Entity\Module\Module;
use App\Entity\Theme\Theme;
use App\Exception\ApiException;
use App\Service\Hook\HookService;
use App\Service\ModuleTheme\Service\ModuleService;
use App\Service\ModuleTheme\Service\ThemeService;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\HttpFoundation\Response;

class ThemeManager extends AbstractManager
{
    private $ts;
    private $pm;
    private $mm;
    private $ifm;
    private $hs;
    private $ms;

    public function __construct(
        EntityManagerInterface $em,
        ThemeService $ts,
        ParameterManager $pm,
        ModuleManager $mm,
        ImageFormatManager $ifm,
        HookService $hs,
        ModuleService $ms
    ) {
        parent::__construct($em);

        $this->ts = $ts;
        $this->pm = $pm;
        $this->mm = $mm;
        $this->ifm = $ifm;
        $this->hs = $hs;
        $this->ms = $ms;
    }

    /**
     * Create new theme
     *
     * @param string $themeName
     * @return Theme
     */
    public function createNewTheme(string $themeName): Theme
    {
        $theme = new Theme();
        $theme->setName($themeName);

        $this->em->persist($theme);
        $this->em->flush();

        return $theme;
    }

    /**
     * Active theme
     *
     * @param Theme $theme
     * @param bool $firstTheme
     *
     * @return void
     * @throws ApiException
     * @throws IOException
     */
    public function active(Theme $theme, bool $firstTheme = false): void
    {
        $mainThemeName = $this->pm->get('main_theme');
        $themeName = $theme->getName();
        if ($themeName === $mainThemeName) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Le thème $themeName ne doit pas correspondre au thème principal actuel...");
        } else if ($firstTheme) {
            $this->disableMainTheme();
        }

        $config = $this->ts->getConfig($themeName);
        $globalSettings = $config['global_settings'];

        $modules = $globalSettings['modules'];
        $this->applyModulesConfig($modules['to_disable'], false, Module::ACTION_DISABLE);
        $this->applyModulesConfig($modules['to_enable'], true, Module::ACTION_INSTALL);

        $imagesTypes = $globalSettings['images_types'];
        $this->applyImagesTypesConfig($imagesTypes, true);

        $hooks = $globalSettings['hooks']['modules_to_hook'];
        $this->applyHooksConfig($hooks, true);

        $this->pm->set('main_theme', $themeName);
        $this->em->flush();
        $this->em->getConnection()->commit();

        $this->ts->entry($themeName, false);
        try {
            $this->ts->clear();
        } catch (\Exception $e) {
            $this->ts->entry($themeName, true);
            $this->ts->entry($mainThemeName, false);
            throw $e;
        }
    }

    /**
     * Delete theme
     *
     * @param Theme $theme
     *
     * @return void
     * @throws ApiException
     * @throws IOException
     */
    public function delete(Theme $theme): void
    {
        $mainThemeName = $this->pm->get('main_theme');
        $themeName = $theme->getName();
        if ($themeName === $mainThemeName) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Le thème $themeName ne doit pas correspondre au thème principal actuel...");
        }

        $this->em->remove($theme);
        $this->em->flush();
        $this->em->getConnection()->commit();
    }

    /**
     * Disable main theme
     *
     * @return void
     * @throws ApiException
     * @throws IOException
     */
    private function disableMainTheme(): void
    {
        $mainThemeName = $this->pm->get('main_theme');

        $mainTheme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($mainThemeName);
        if (null === $mainTheme) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le thème $mainThemeName n'existe pas.");
        }

        $config = $this->ts->getConfig($mainThemeName);
        $globalSettings = $config['global_settings'];

        // Disable active module
        $toDisable = $globalSettings['modules']['to_enable'];
        $this->applyModulesConfig($toDisable, false, Module::ACTION_DISABLE);

        // Disable imageFormat of theme
        $imagesTypes = $globalSettings['images_types'];
        $this->applyImagesTypesConfig($imagesTypes, false);

        // Disable module register to hook
        $hooks = $globalSettings['hooks']['modules_to_hook'];
        $this->applyHooksConfig($hooks, false);

        $this->ts->entry($mainThemeName, true);
    }

    /**
     * Apply action on modules found in theme configuration
     *
     * @param array $modulesName
     * @param bool $activeCondition
     * @param int $action
     *
     * @return void
     * @throws ApiException
     * @throws IOException
     */
    private function applyModulesConfig(array $modulesName, bool $activeCondition, int $action): void
    {
        foreach ($modulesName as $moduleName) {
            $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
            if (null === $module) {
                if (!is_dir($this->ms->getDir() . '/' . $moduleName)) {
                    continue;
                }

                if ($action !== Module::ACTION_INSTALL) {
                    continue;
                }

                // Module install from disk
                $this->ms->install($moduleName);
                $module = $this->mm->createNewModule($moduleName, false);
            } else if ($module->isActive() === $activeCondition) {
                continue;
            }
            $this->mm->doAction($module, $action, false);
        }
    }

    /**
     * Activation of theme: Set new format if image format exists or create new format
     * Deactivation of theme: Set false the themeUse of all image format
     *
     * @param array $imagesTypes
     * @param bool $active
     * 
     * @return void
     */
    private function applyImagesTypesConfig(array $imagesTypes, bool $active)
    {
        foreach ($imagesTypes as $name => $format) {
            $imageFormat = $this->em->getRepository(ImageFormat::class)->findOneByNameForAdmin($name);

            if (!$imageFormat) {
                if ($active) {
                    $imageFormat = new ImageFormat();
                    $imageFormat->setName($name);
                } else {
                    throw new ApiException(Response::HTTP_NOT_FOUND, 1404,
                        "Le format d'image $name n'existe plus, ce format est utilisé par le thème.");
                }
            }

            if ($active) {
                $imageFormat->setHeight($format['height']);
                $imageFormat->setWidth($format['width']);
            }
            $imageFormat->setThemeUse($active);

            $this->em->persist($imageFormat);
        }

        $this->em->flush();

        if ($active) {
            $this->ifm->generateThumbnails();
        }
    }

    private function applyHooksConfig(array $modulesToHook, bool $register): void
    {
        foreach ($modulesToHook as $hookName => $modulesName) {
            $position = 0;
            foreach ($modulesName as $moduleName) {
                $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
                if (null === $module) {
                    // Ignore if module doesn't exist
                    continue;
                }

                $hook = $this->em->getRepository(Hook::class)->findOneByNameAndModuleNameForAdmin($hookName, $moduleName);
                if (null !== $hook && $register || null === $hook && !$register) {
                    continue;
                }

                $moduleConfig = $this->ms->getModuleConfigInstance($moduleName);
                $register
                    ? $this->hs->register($hookName, $moduleConfig, $position++)
                    : $this->hs->unregister($hookName, $moduleConfig);
            }
        }
    }
}