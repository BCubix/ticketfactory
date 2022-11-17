<?php

namespace App\Service\Module;

use App\Service\Db\Db;

class ModuleService
{
    public const MODULES_DIR = __DIR__.'/../../../modules';

    /**
     * Call configuration function of a module.
     *
     * @param string $moduleFolderName Module's name
     * @param string $functionName     Function to call
     * @return void
     */
    public static function callConfig(string $moduleFolderName, string $functionName)
    {
        $moduleConfigPath = self::MODULES_DIR.'/'.$moduleFolderName.'/'.$moduleFolderName.'Config.php';
        if (!is_file($moduleConfigPath)) {
            return;
        }

        require_once $moduleConfigPath;

        if (!class_exists($moduleFolderName.'Config')) {
            return;
        }

        $moduleObj = new ($moduleFolderName.'Config')();
        if (!method_exists($moduleObj, 'install')) {
            return;
        }

        if (method_exists($moduleObj, $functionName)) {
            $moduleObj->{$functionName}();
        }
    }

    /**
     * Get all active modules by query in database.
     *
     * @return array List of active modules
     */
    public static function getModulesActive()
    {
        $dbname = Db::getInstance()->getDbname();

        // Check if table of module exists
        $result = Db::getInstance()->query("SELECT * FROM INFORMATION_SCHEMA.TABLES\n"
            . "WHERE TABLE_SCHEMA = '". $dbname ."' AND TABLE_NAME = 'module'");
        if (!$result)
            return [];

        return Db::getInstance()->query("SELECT * FROM module");
    }


    /**
     * Delete directory recursively.
     *
     * @param $path
     * @return void
     */
    private static function removeDirectory($path)
    {
        if (!is_dir($path))
            return;

        $files = glob($path.'/*');
        foreach ($files as $file) {
            is_dir($file) ? self::removeDirectory($file) : unlink($file);
        }
        rmdir($path);
    }

    /**
     * Delete module folder.
     *
     * @param string $moduleFolderName
     * @return void
     */
    public static function deleteModuleFolder(string $moduleFolderName)
    {
        self::removeDirectory(self::MODULES_DIR.'/'.$moduleFolderName);
    }
}