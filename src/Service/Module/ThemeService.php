<?php

namespace App\Service\Module;

use App\Exception\ApiException;
use Symfony\Component\HttpFoundation\Response;

class ThemeService extends ModuleServiceAbstract
{
    protected const PATH = '/themes/Website';
    protected const MODULE_SERVICE_NAME = 'theme';

    public const ZIP_FILES_OR_DIRS_NOT_CORRESPONDED = "Le zip contient des fichiers ou dossiers qui ne correspondent pas à l'architecture d'un thème";

    protected function checkTree(array $tree)
    {
        // Name of theme
        $name = array_key_first($tree);

        foreach (array_keys($tree[$name]) as $key) {
            if ($key === 'assets') {
                continue;
            } else if ($key === 'config') {
                continue;
            } else if ($key === 'modules') {
                continue;
            } else if ($key === 'templates') {
                continue;
            }

            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
                static::ZIP_FILES_OR_DIRS_NOT_CORRESPONDED . ' : ' . (is_numeric($key) ? $tree[$name][$key] : $key));
        }
    }
}