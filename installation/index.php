<?php

defined('_TF_CACHE_DIR_') || define('_TF_CACHE_DIR_', _TF_ROOT_DIR_ . 'var/cache/');
defined('_TF_PUBLIC_DIR_') || define('_TF_PUBLIC_DIR_', _TF_ROOT_DIR_ . 'public/');
defined('_TF_INSTALL_PATH_') || define('_TF_INSTALL_PATH_', dirname(__FILE__) . DIRECTORY_SEPARATOR);
defined('_TF_INSTALL_CLASSES_PATH_') || define('_TF_INSTALL_CLASSES_PATH_', _TF_INSTALL_PATH_ . 'classes/');
defined('_TF_INSTALL_DATA_PATH_') || define('_TF_INSTALL_DATA_PATH_', _TF_INSTALL_PATH_ . 'data/');
defined('_TF_INSTALL_CONTROLLERS_PATH_') || define('_TF_INSTALL_CONTROLLERS_PATH_', _TF_INSTALL_PATH_ . 'controller/');

defined('_PHP_MIN_VERSION_') || define('_PHP_MIN_VERSION_', '7.2.5');

require_once _TF_ROOT_DIR_ . 'vendor/autoload.php';

foreach (new DirectoryIterator(_TF_INSTALL_CLASSES_PATH_) as $file) {
    if ($file->isDot()) {
        continue;
    }
    require_once _TF_INSTALL_CLASSES_PATH_ . $file->getFilename();
}

require_once _TF_INSTALL_CONTROLLERS_PATH_ . 'InstallController.php';
