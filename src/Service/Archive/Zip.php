<?php

namespace App\Service\Archive;

use App\Exception\ApiException;

use Symfony\Component\HttpFoundation\Response;

class Zip
{
    public const SERVICE_NAME = 'zip';

    public const ZIP_FAIL_OPEN           = "L'ouverture du zip a échoué.";
    public const ZIP_FAIL_EXTRACT        = "L'extraction du zip a échoué.";

    /**
     * Unzip
     *
     * @param string $zipPath
     * @param string $pathTo    Path to extract the zip
     * @param bool   $rmZipFile Remove the zip file if true
     *
     * @return void
     * @throws ApiException
     */
    public static function unzip(string $zipPath, string $pathTo, bool $rmZipFile = true): void
    {
        $zip = new \ZipArchive();

        $result = $zip->open($zipPath);
        if ($rmZipFile) {
            unlink($zipPath);
        }

        if (TRUE !== $result) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, static::ZIP_FAIL_OPEN);
        }

        if (TRUE !== $zip->extractTo($pathTo)) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, static::ZIP_FAIL_EXTRACT);
        }

        $zip->close();
    }
}