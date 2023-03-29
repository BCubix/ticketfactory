<?php

namespace App\Service\Exec;

use App\Exception\ApiException;

use Symfony\Component\HttpFoundation\Response;

class ExecCommand
{
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