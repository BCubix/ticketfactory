<?php

namespace TicketFactory\Installer\Classes\Requirements;

use TicketFactory\Installer\Classes\Tools\InstallerTools;

class Requirements
{
    private static $requirements = [
        'phpversion' => false,
        'system' => [
            'fopen', 'fclose', 'fread', 'fwrite',
            'rename', 'file_exists', 'unlink', 'rmdir', 'mkdir',
            'getcwd', 'chdir', 'chmod',
        ],
        'root_dir' => '.',
    ];

    public static function checkRequirements()
    {
        $tests = static::check();

        $success = true;
        foreach ($tests as $result) {
            $success &= ($result === 'ok');
        }

        return ['success' => $success, 'checks' => $tests];
    }

    private static function check()
    {
        $res = [];
        foreach (static::$requirements as $key => $test) {
            if (call_user_func([self::class, 'test_' . $key], $test)) {
                $res[$key] = 'ok';
            } else {
                $res[$key] = 'fail';
            }
        }
        return $res;
    }

    private static function test_phpversion()
    {
        return version_compare(PHP_VERSION, _PHP_MIN_VERSION_, '>=');
    }

    private static function test_system($funcs)
    {
        foreach ($funcs as $func) {
            if (!function_exists($func)) {
                return false;
            }
        }

        return true;
    }

    private static function test_dir($relative_dir, $recursive = false)
    {
        $dir = rtrim(_TF_ROOT_DIR_, '\\/') . DIRECTORY_SEPARATOR . trim($relative_dir, '\\/');
        if (!file_exists($dir) || !$dh = @opendir($dir)) {
            return false; // Directory does not exist or is not writable
        }
        closedir($dh);
        $dummy = rtrim($dir, '\\/') . DIRECTORY_SEPARATOR . uniqid();
        if (@file_put_contents($dummy, 'test')) {
            @unlink($dummy);
            if (!$recursive) {
                return true;
            }
        } elseif (!is_writable($dir)) {
            return false; // Directory is not writable
        }

        if ($recursive) {
            foreach (InstallerTools::getDirectories($dir) as $file) {
                if (!static::test_dir($relative_dir . DIRECTORY_SEPARATOR . $file, $recursive)) {
                    return false;
                }
            }
        }

        return true;
    }

    private static function test_root_dir($dir)
    {
        return static::test_dir($dir);
    }
}
