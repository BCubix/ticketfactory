<?php

use App\Service\Db\Db;
use Symfony\Config\TwigConfig;

return static function (TwigConfig $twig) {
    $twig->path('%kernel.project_dir%/themes/Admin/default/templates', 'admin');

    try {
        $result = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'main_theme'");
        if (count($result) !== 1) {
            return;
        }

        $parameter = $result[0];
        $name = $parameter['param_value'];
        if (null === $name) {
            return;
        }

        $result = Db::getInstance()->query("SELECT * FROM theme WHERE name = '$name'");
        if (count($result) !== 1) {
            return;
        }

        $theme = $result[0];
        $themeName = $theme['name'];

        $twig->path('%kernel.project_dir%/themes/Website/' . $themeName . '/templates', 'website');
    } catch (\Exception $e) {
        throw new \Exception($e->getMessage());
    }
};
