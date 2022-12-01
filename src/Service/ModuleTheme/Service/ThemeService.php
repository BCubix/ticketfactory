<?php

namespace App\Service\ModuleTheme\Service;

use App\Exception\ApiException;
use App\Service\ModuleTheme\Config\ThemeConfig;
use App\Utils\Exec;
use App\Utils\FileManipulator;

use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Yaml;

class ThemeService extends ServiceAbstract
{
    protected const PATH = '/themes/Website';

    public const ZIP_FILES_OR_DIRS_NOT_CORRESPONDED = "Le zip contient des fichiers ou dossiers qui ne correspondent pas à l'architecture d'un thème";
    public const ZIP_ASSETS_FILE_INDEX_NOT_FOUND = "Le dossier assets ne contient pas le fichier index.js.";
    public const ZIP_CONFIG_FILE_NOT_FOUND = "Le dossier config ne contient pas le fichier de configuration.";
    public const ZIP_TEMPLATES_INDEX_NOT_FOUND = "Le dossier templates ne contient pas le fichier index.html.twig.";

    /**
     * Inject or remove entry in webpack.
     *
     * @param string $name
     * @param bool $remove
     *
     * @return void
     * @throws ApiException
     */
    public function entry(string $name, bool $remove): void
    {
        $webpackFilePath = $this->projectDir . '/webpack.config.js';

        $file = new FileManipulator($webpackFilePath);
        $content = $file->getContent();

        $needleAppEntry= ".addEntry('app', './themes/Admin/default/assets/index.js')";
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
     * Return the information from the theme config
     *
     * @param string $name
     *
     * @return array
     * @throws ApiException
     */
    public function getConfig(string $name): array
    {
        $config = Yaml::parseFile($this->dir . '/' . $name . '/config/config.yaml');
        if (!$config) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le fichier de configuration du thème $name est vide.");
        }

        $processor = new Processor();
        $themeConfig = new ThemeConfig();

        return $processor->processConfiguration($themeConfig, [ 'theme' => $config ]);
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

        throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
            static::ZIP_FILES_OR_DIRS_NOT_CORRESPONDED . ' : ' . (is_numeric($nodeKey) ? $nodeValue : $nodeKey));
    }

    public function clear(): void
    {
        parent::clear();

        Exec::exec('yarn run encore production');
    }
}