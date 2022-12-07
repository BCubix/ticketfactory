<?php

namespace App\Manager;

use App\Entity\Media\ImageFormat;
use App\Entity\Module\Module;
use App\Entity\Theme\Theme;
use App\Exception\ApiException;
use App\Service\ModuleTheme\Service\ThemeService;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;

class ThemeManager extends AbstractManager
{
    private $fs;
    private $ts;
    private $pm;
    private $mm;
    private $ifm;

    public function __construct(EntityManagerInterface $em, Filesystem $fs, ThemeService $ts, ParameterManager $pm, ModuleManager $mm, ImageFormatManager $ifm)
    {
        parent::__construct($em);

        $this->fs = $fs;
        $this->ts = $ts;
        $this->pm = $pm;
        $this->mm = $mm;
        $this->ifm = $ifm;
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
     *
     * @return void
     * @throws ApiException
     * @throws IOException
     */
    public function active(Theme $theme): void
    {
        $this->disableMainTheme();

        $config = $this->ts->getConfig($theme->getName());
        $globalSettings = $config['global_settings'];

        $modules = $globalSettings['modules'];
        $this->applyModulesConfig($modules['to_disable'], false, Module::ACTION_DISABLE);
        $this->applyModulesConfig($modules['to_enable'], true, Module::ACTION_INSTALL);

        $imagesTypes = $globalSettings['images_types'];
        $this->applyImagesTypesConfig($imagesTypes, true);

        $this->pm->set('main_theme', $theme->getName());
        $this->em->flush();

        $this->ts->entry($theme->getName(), false);
        $this->ts->clear();
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
        if ($mainThemeName === $theme->getName()) {
            $this->disableMainTheme();
            $this->ts->clear();
        }

        $this->em->remove($theme);
        $this->em->flush();
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
        if (null === $mainThemeName) {
            return;
        }

        $mainTheme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($mainThemeName);
        if (null === $mainTheme) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le thème $mainThemeName n'existe pas.");
        }

        $this->pm->set('main_theme', null);
        $this->em->flush();

        $config = $this->ts->getConfig($mainThemeName);
        $globalSettings = $config['global_settings'];

        // Disable module actived
        $toDisable = $globalSettings['modules']['to_enable'];
        $this->applyModulesConfig($toDisable, false, Module::ACTION_DISABLE);

        // Disable imageFormat of theme
        $imagesTypes = $globalSettings['images_types'];
        $this->applyImagesTypesConfig($imagesTypes, false);

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
            if (null === $module || $module->isActive() === $activeCondition) {
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
}