<?php

namespace App\Utils;

use App\Exception\ApiException;
use Symfony\Component\HttpFoundation\Response;

class GetClass
{
    /**
     * Return instance of class.
     *
     * @param string $path
     * @param string $className
     * @param array $args
     *
     * @return mixed
     * @throws ApiException
     */
    public static function getClass(string $path, string $className, array $args = [])
    {
        if (!is_file($path)) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "Le fichier $path n'existe pas.");
        }

        require_once $path;

        if (!class_exists($className)) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "La classe $className n'existe pas.");
        }

        return new ($className)(...$args);
    }
}