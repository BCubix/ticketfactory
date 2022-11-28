<?php

namespace App\Utils;

class Zip
{
    public const ZIP_FAIL_OPEN           = "L'ouverture du zip a échoué.";
    public const ZIP_FAIL_EXTRACT        = "L'extraction du zip a échoué.";
    public const ZIP_EMPTY               = "Le zip est vide.";
    public const ZIP_FIRST_DIR_REQUIRED  = "Le zip doit contenir uniquement un dossier à la racine.";

    /**
     * Unzip
     *
     * @param string $zipPath
     * @param string $pathTo    Path to extract the zip
     * @param bool   $rmZipFile Remove the zip file if true
     * @return void
     * @throws \Exception
     */
    public static function unzip(string $zipPath, string $pathTo, bool $rmZipFile = true)
    {
        $zip = new \ZipArchive();

        $result = $zip->open($zipPath);
        if ($rmZipFile) {
            unlink($zipPath);
        }

        if (TRUE !== $result) {
            throw new \Exception(static::ZIP_FAIL_OPEN);
        }

        if (TRUE !== $zip->extractTo($pathTo)) {
            throw new \Exception(static::ZIP_FAIL_EXTRACT);
        }

        $zip->close();
    }

    /**
     * Return a tree from zip
     *
     * @param string $zipPath
     * @return array
     * @throws \Exception
     */
    public static function getTreeFromZip(string $zipPath): array
    {
        $zip = new \ZipArchive();

        if (TRUE !== $zip->open($zipPath)) {
            throw new \Exception(static::ZIP_FAIL_OPEN);
        }

        $tree = static::buildTreeFromZip($zip);

        $zip->close();

        return $tree;
    }

    /**
     * Build a tree from zip
     *
     * @param \ZipArchive $zip
     * @return array
     */
    private static function buildTreeFromZip(\ZipArchive $zip): array
    {
        $tree = [];

        // Visit all files or directories of zip
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $path = $zip->getNameIndex($i);
            $pathBySlash = array_values(explode('/', rtrim($path, '/')));
            $len = count($pathBySlash);

            // Go to the last array correspond as the last directory of path
            $tmp = &$tree;
            for ($j = 0; $j < $len - 1; $j++) {
                $tmp = &$tmp[$pathBySlash[$j]];
            }

            if (substr($path, -1) == '/') {
                // Add new array if the path is a directory
                $tmp[$pathBySlash[$len - 1]] = [];
            } else {
                // Add in array is the path is a file
                $tmp[] = $pathBySlash[$len - 1];
            }
        }

        return $tree;
    }
}