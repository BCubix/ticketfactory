<?php

use App\Kernel;

defined('_TF_ROOT_DIR_') || define('_TF_ROOT_DIR_', dirname(__DIR__) . DIRECTORY_SEPARATOR);

require_once _TF_ROOT_DIR_ . '/vendor/autoload_runtime.php';

if (file_exists(_TF_ROOT_DIR_ . '/installation')) {
    require_once 'install/index.php';
}

if (!file_exists(_TF_ROOT_DIR_ . '/installation')) {
    return function (array $context) {
        return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
    };
}
