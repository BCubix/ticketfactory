<?php

namespace App\Utils;

use Symfony\Component\Finder\Exception\DirectoryNotFoundException;

class System
{
    /**
     * Remove directory (not empty)
     *
     * @param string $path
     *
     * @return void
     */
    public static function rmdir(string $path)
    {
        if (!is_dir($path)) {
            throw new DirectoryNotFoundException($path);
        }

        $files = glob($path . '/*');
        foreach ($files as $file) {
            is_dir($file) ? static::rmdir($file) : unlink($file);
        }

        rmdir($path);
    }

    /**
     * Exec command
     *
     * @param string $command
     *
     * @return void
     * @throws \Exception
     */
    public static function exec(string $command)
    {
        $output = [];
        exec($command, $output, $res);
        if (0 !== $res) {
            throw new \Exception("La commande '$command' a échoué (code: $res) : " . implode(PHP_EOL, $output));
        }
    }
}