<?php

namespace App\Service\Module;

use App\Exception\ApiException;
use Symfony\Component\HttpFoundation\Response;

class ThemeService extends ModuleServiceAbstract
{
    protected const PATH = '/themes/Website';
    protected const MODULE_SERVICE_NAME = 'theme';

    public const ZIP_FILES_OR_DIRS_NOT_CORRESPONDED = "Le zip contient des fichiers ou dossiers qui ne correspondent pas à l'architecture d'un thème";
    public const ZIP_ASSETS_FILE_INDEX_NOT_FOUND = "Le dossier assets ne contient pas le fichier index.js.";
    public const ZIP_TEMPLATES_INDEX_NOT_FOUND = "Le dossier templates ne contient pas le fichier index.html.twig.";

    private $webpackFilePath;

    public function __construct($projectDir)
    {
        parent::__construct($projectDir);
        $this->webpackFilePath = $projectDir . '/webpack.config.js';
    }

    public function modifyAssetsWebpack(string $themeName, bool $add)
    {
        $assetsPath = $this->dir . '/' . $themeName . '/assets';
        $space = PHP_EOL . "    ";

        $content = file_get_contents($this->webpackFilePath);

        $appAssetEntry = ".addEntry('app', './themes/Admin/default/assets/index.js')";
        $pos = strpos($content, $appAssetEntry) + strlen($appAssetEntry);
        $str = substr($content, 0, $pos);

        $websiteAssetEntry = ".addEntry('website', '$assetsPath/index.js')";
        if ($add) {
            $str .= $space . $websiteAssetEntry;
        } else {
            $pos = strpos($content, $websiteAssetEntry) + strlen($websiteAssetEntry);
        }

        $str .= substr($content, $pos);

        file_put_contents($this->webpackFilePath, $str);
    }

    protected function checkTree(array $tree): void
    {
        // Name of theme
        $name = array_key_first($tree);

        foreach (array_keys($tree[$name]) as $key) {
            $child = $tree[$name][$key];

            if ($key === 'assets') {
                if (!isset($child[0]) || $child[0] !== "index.js") {
                    throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_ASSETS_FILE_INDEX_NOT_FOUND);
                }
                continue;
            } else if ($key === 'config') {
                continue;
            } else if ($key === 'modules') {
                continue;
            } else if ($key === 'templates') {
                if (!isset($child[0]) || $child[0] !== "index.html.twig") {
                    throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_TEMPLATES_INDEX_NOT_FOUND);
                }
                continue;
            }

            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
                static::ZIP_FILES_OR_DIRS_NOT_CORRESPONDED . ' : ' . (is_numeric($key) ? $child : $key));
        }
    }

    public function clear(): void
    {
        parent::clear();

        if (NULL === shell_exec('yarn run encore production')) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La commande yarn run encore production a échoué.");
        }
    }
}