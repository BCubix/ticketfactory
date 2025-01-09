<?php

use App\Kernel;

defined('_TF_ROOT_DIR_') || define('_TF_ROOT_DIR_', dirname(__DIR__) . DIRECTORY_SEPARATOR);

require_once _TF_ROOT_DIR_ . '/vendor/autoload_runtime.php';

return function (array $context) {
    if (file_exists(_TF_ROOT_DIR_ . '/installation') && ((isset($context['INSTALLATION_STATUS']) && $context['INSTALLATION_STATUS'] !== "installed") || !isset($context['INSTALLATION_STATUS']))) {
        require_once 'install/index.php';
    }

    if (!file_exists(_TF_ROOT_DIR_ . '/installation') || (isset($context['INSTALLATION_STATUS']) && $context['INSTALLATION_STATUS'] === "installed")) {
        return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
    }
};
