<?php

namespace App\Utils;

use App\Exception\ApiException;

use Symfony\Component\HttpFoundation\Response;

class System
{
    /**
     * Remove directory (not empty)
     *
     * @param string $path
     *
     * @return void
     * @throws ApiException
     */
    public static function rmdir(string $path): void
    {
        if (!is_dir($path)) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Le path $path n'est pas un dossier.");
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
     * @throws ApiException
     */
    public static function exec(string $command): void
    {
        $output = [];
        exec($command, $output, $res);
        if (0 !== $res) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "La commande '$command' a échoué (exit code: $res) : " . implode(PHP_EOL, $output));
        }
    }
}