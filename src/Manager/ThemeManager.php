<?php

namespace App\Manager;

use App\Entity\Hook\Hook;
use App\Entity\Media\ImageFormat;
use App\Entity\Module\Module;
use App\Entity\Theme\Theme;
use App\Exception\ApiException;
use App\Service\Hook\HookService;
use App\Service\ModuleTheme\Config\ThemeConfig;
use App\Utils\Exec;
use App\Utils\FileManipulator;

use App\Utils\PathGetter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Yaml;

class ThemeManager extends ModuleThemeManager
{
    public const ZIP_FILES_OR_DIRS_NOT_CORRESPONDED = "Le zip contient des fichiers ou dossiers qui ne correspondent pas à l'architecture d'un thème";
    public const ZIP_ASSETS_FILE_INDEX_NOT_FOUND = "Le dossier assets ne contient pas le fichier index.js.";
    public const ZIP_CONFIG_FILE_NOT_FOUND = "Le dossier config ne contient pas le fichier de configuration.";
    public const ZIP_TEMPLATES_INDEX_NOT_FOUND = "Le dossier templates ne contient pas le fichier index.html.twig.";

    private $pm;
    private $mm;
    private $ifm;
    private $hs;

    public function __construct(
        EntityManagerInterface $em,
        PathGetter             $pg,
        Filesystem             $fs,
        ParameterManager       $pm,
        ModuleManager          $mm,
        ImageFormatManager     $ifm,
        HookService            $hs
    ) {
        parent::__construct($em, $pg, $fs);

        $this->dir = $this->pg->getThemesDir();

        $this->pm  = $pm;
        $this->mm  = $mm;
        $this->ifm = $ifm;
        $this->hs  = $hs;
    }

    public function getAll(array $filters = []): array
    {
        $themesInDisk = parent::getAll($filters);

        for ($i = 0; $i < count($themesInDisk); ++$i) {
            unset($themesInDisk[$i]['global_settings']);
        }

        return $themesInDisk;
    }

    public function getConfiguration(string $objectName): array
    {
        $config = Yaml::parseFile($this->dir . '/' . $objectName . '/config/config.yaml');
        if (!$config) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le fichier de configuration du thème $objectName est vide.");
        }

        $processor = new Processor();
        $themeConfig = new ThemeConfig();

        return $processor->processConfiguration($themeConfig, ['theme' => $config]);
    }

    public function getImage(string $objectName): array
    {
        $imagePathWithoutExt = $this->dir . "/$objectName/preview";
        $imageUrlWithoutExt = "themes/$objectName/preview";

        $ext = null;
        if (is_file("$imagePathWithoutExt.png")) {
            $ext = 'png';
        } else if (is_file("$imagePathWithoutExt.jpg")) {
            $ext = 'jpg';
        }

        if (null !== $ext) {
            $this->fs->copy("$imagePathWithoutExt.$ext", "{$this->pg->getProjectDir()}public/$imageUrlWithoutExt.$ext");
            $ext = "/$imageUrlWithoutExt.$ext";
        }

        return ['previewUrl' => $ext];
    }

    public function install(string $objectName): array
    {
        $tree = parent::install($objectName);

        if (isset($tree[$objectName]['config']['modules'])) {
            foreach ($tree[$objectName]['config']['modules'] as $moduleName => $value) {
                $targetDir = $this->pg->getModulesDir() . '/' . $moduleName;
                if (!is_dir($targetDir)) {
                    $originDir = $this->dir . '/' . $objectName . '/config/modules/' . $moduleName;
                    $this->fs->mirror($originDir, $targetDir);
                }
            }
        }

        return $tree;
    }

    protected function checkNode(int|string $nodeKey, string|array $nodeValue, string $rootName): void
    {
        if ($nodeKey === 'assets') {
            if (!isset($nodeValue[0]) || $nodeValue[0] !== "index.js") {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_ASSETS_FILE_INDEX_NOT_FOUND);
            }
            return;
        }

        if ($nodeKey === 'config') {
            if (!isset($nodeValue[0]) || $nodeValue[0] !== "config.yaml") {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_CONFIG_FILE_NOT_FOUND);
            }
            return;
        }

        if ($nodeKey === 'modules') {
            return;
        }

        if ($nodeKey === 'templates') {
            if (!isset($nodeValue[0]) || $nodeValue[0] !== "index.html.twig") {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_TEMPLATES_INDEX_NOT_FOUND);
            }
            return;
        }

        if ($nodeValue === 'preview.jpg' || $nodeValue === 'preview.png') {
            return;
        }

        throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
            static::ZIP_FILES_OR_DIRS_NOT_CORRESPONDED . ' : ' . (is_numeric($nodeKey) ? $nodeValue : $nodeKey));
    }

    public function clear(): void
    {
        parent::clear();

        Exec::exec('yarn run encore production');
    }

    /**
     * Get admin templates path.
     *
     * @return string
     */
    public function getAdminTemplatesPath(): string
    {
        return "Admin/" . $this->pm->get('admin_theme') . "/templates/";
    }

    /**
     * Get website templates path.
     *
     * @return string
     */
    public function getWebsiteTemplatesPath(): string
    {
        return "Website/" . $this->pm->get('main_theme') . "/templates/";
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
    public function entry(string $name, bool $remove): void
    {
        $webpackFilePath = $this->pg->getProjectDir() . 'webpack.config.js';

        $file = new FileManipulator($webpackFilePath);
        $content = $file->getContent();

        $needleAppEntry = ".addEntry('app', './themes/Admin/default/assets/index.js')";
        $needleWebsiteEntry = ".addEntry('website', './themes/Website/" . $name . "/assets/index.js')";

        // Find position of the end of app entry in content
        $position = $file->getPosition($needleAppEntry) + strlen($needleAppEntry);
        // Add content start the beginning content to the end of app entry
        $newContent = substr($content, 0, $position);

        if (!$remove) {
            // Add website entry
            $newContent .= PHP_EOL . "    " . $needleWebsiteEntry;
        } else {
            // Find position of the end of website entry in content
            $position = $file->getPosition($needleWebsiteEntry) + strlen($needleWebsiteEntry);
        }

        // Add rest of content
        $newContent .= substr($content, $position);

        $file->setContent($newContent);
    }

    /**
     * Active theme with disable old main theme.
     *
     * Active theme not installed : install, add in database, apply config and clear.
     * Active theme installed     : apply config and clear.
     *
     * @param string $themeName
     * @param bool   $firstTheme
     *
     * @return Theme
     * @throws \Exception
     */
    public function active(string $themeName, bool $firstTheme = false): Theme
    {
        $theme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($themeName);
        if (null === $theme) {
            $this->install($themeName);

            $theme = new Theme();
            $theme->setName($themeName);

            $this->em->persist($theme);
            $this->em->flush();
        }

        $mainThemeName = $this->pm->get('main_theme');
        if (!$firstTheme) {
            if ($themeName === $mainThemeName) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Le thème $themeName ne doit pas correspondre au thème principal actuel...");
            } else {
                $this->disableMainTheme();
            }
        }

        $config = $this->getConfiguration($themeName);
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

        $this->entry($mainThemeName, true);
        $this->entry($themeName, false);
        try {
            $this->clear();
        } catch (\Exception $e) {
            $this->entry($themeName, true);
            $this->entry($mainThemeName, false);
            throw $e;
        }

        return $theme;
    }

    /**
     * Delete theme in database and in project.
     *
     * @param string $themeName
     *
     * @return void
     * @throws \Exception
     */
    public function delete(string $themeName): void
    {
        $theme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($themeName);
        if (null === $theme) {
            return;
        }

        $mainThemeName = $this->pm->get('main_theme');
        if ($themeName === $mainThemeName) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Le thème $themeName ne doit pas correspondre au thème principal actuel...");
        }

        $this->em->remove($theme);
        $this->em->flush();
        if ($this->em->getConnection()->isTransactionActive()) {
            $this->em->getConnection()->commit();
        }

        $this->deleteInDisk($themeName);
    }

    /**
     * Disable main theme.
     *
     * @return void
     * @throws \Exception
     */
    private function disableMainTheme(): void
    {
        $mainThemeName = $this->pm->get('main_theme');

        $mainTheme = $this->em->getRepository(Theme::class)->findOneByNameForAdmin($mainThemeName);
        if (null === $mainTheme) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le thème $mainThemeName n'existe pas.");
        }

        $config = $this->getConfiguration($mainThemeName);
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
    }

    /**
     * Apply action on modules found in theme configuration.
     *
     * @param array $modulesName
     * @param bool  $activeCondition
     * @param int   $action
     *
     * @return void
     * @throws \Exception
     */
    private function applyModulesConfig(array $modulesName, bool $activeCondition, int $action): void
    {
        foreach ($modulesName as $moduleName) {
            $this->mm->active($moduleName, $action, $activeCondition);
        }
    }

    /**
     * Activation of theme  : Set new format if image format exists or create new format
     * Deactivation of theme: Set false the themeUse of all image format
     *
     * @param array $imagesTypes
     * @param bool  $active
     *
     * @return void
     * @throws \Exception
     */
    private function applyImagesTypesConfig(array $imagesTypes, bool $active): void
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
            $this->em->flush();
        }

        if ($active) {
            $this->ifm->generateThumbnails();
        }
    }

    /**
     * Apply hook configuration : register or unregister hook.
     *
     * @param array $modulesToHook
     * @param bool  $register
     *
     * @return void
     * @throws \Exception
     */
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

                $moduleConfig = $this->mm->getModuleConfigInstance($moduleName);
                $register
                    ? $this->hs->register($hookName, $moduleConfig, $position++)
                    : $this->hs->unregister($hookName, $moduleConfig);
            }
        }
    }
}