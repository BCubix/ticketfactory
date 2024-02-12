<?php

use TicketFactory\Installer\Controller\InstallController\InstallController;

require_once _TF_ROOT_DIR_ . 'installation/index.php';
$installed = InstallController::execute();

function rrmdir($src)
{
    $dir = opendir($src);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            $full = $src . '/' . $file;
            if (is_dir($full)) {
                rrmdir($full);
            } else {
                unlink($full);
            }
        }
    }
    closedir($dir);
    rmdir($src);
}

if (file_exists(_TF_ROOT_DIR_ . '/.env.local') && $installed) {
    rrmdir(_TF_ROOT_DIR_ . '/installation');
}
