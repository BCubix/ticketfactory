<?php

use App\Service\Db\Db;
use Symfony\Config\TwigConfig;

return static function (TwigConfig $twig) {
    $twig->path('%kernel.project_dir%/themes/Admin/default/templates', 'admin');

    try {
        $result = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'main_theme'");
        $parameter = $result[0];

        $id = $parameter['param_value'];
        $result = Db::getInstance()->query("SELECT * FROM theme WHERE id = $id");

        $theme = $result[0];
        $themeName = $theme['name'];

        $twig->path('%kernel.project_dir%/themes/Website/' . $themeName . '/templates', 'website');

    } catch (\Exception $e) {
        throw new \Exception("Erreur dans l'installation des twig du thème principal.");
    }
};