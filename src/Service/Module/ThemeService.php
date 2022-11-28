<?php

namespace App\Service\Module;

use App\Exception\ApiException;
use App\Utils\System;
use Symfony\Component\HttpFoundation\Response;

class ThemeService extends ModuleServiceAbstract
{
    protected const PATH = '/themes/Website';
    protected const CONFIG_CLASS = ThemeConfig::class;
    protected const CONFIG_PATH = "/config";

    public const ZIP_FILES_OR_DIRS_NOT_CORRESPONDED = "Le zip contient des fichiers ou dossiers qui ne correspondent pas à l'architecture d'un thème";
    public const ZIP_ASSETS_FILE_INDEX_NOT_FOUND = "Le dossier assets ne contient pas le fichier index.js.";
    public const ZIP_CONFIG_FILE_NOT_FOUND = "Le dossier config ne contient pas le fichier de configuration.";
    public const ZIP_TEMPLATES_INDEX_NOT_FOUND = "Le dossier templates ne contient pas le fichier index.html.twig.";

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
                if (!isset($child[0]) || $child[0] !== $name . "Config.php") {
                    throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, static::ZIP_CONFIG_FILE_NOT_FOUND);
                }
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

        System::exec('yarn run encore production');
    }
}