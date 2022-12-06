<?php

namespace App\Manager;

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

    public function __construct(EntityManagerInterface $em, Filesystem $fs, ThemeService $ts, ParameterManager $pm, ModuleManager $mm)
    {
        parent::__construct($em);

        $this->fs = $fs;
        $this->ts = $ts;
        $this->pm = $pm;
        $this->mm = $mm;
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
        $modules = $config['global_settings']['modules'];

        $this->applyModulesConfig($modules['to_disable'], false, Module::ACTION_DISABLE);
        $this->applyModulesConfig($modules['to_enable'], true, Module::ACTION_INSTALL);

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

        // Disable module actived
        $toDisable = $config['global_settings']['modules']['to_enable'];
        $this->applyModulesConfig($toDisable, false, Module::ACTION_DISABLE);

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
}