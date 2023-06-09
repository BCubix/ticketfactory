<?php

namespace App\Service\File;

use App\Exception\ApiException;

use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;

class FileManipulator
{
    public const SERVICE_NAME = 'file';

    private $fs;

    public function __construct(FileSystem $fs)
    {
        $this->fs = $fs;
    }

    /**
     * @return string
     */
    public function getContent(string $filePath): string
    {
        $content = file_get_contents($filePath);
        if (false === $content) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
                "La lecture du fichier $filePath a échoué.");
        }

        return $content;
    }

    /**
     * @param string $newContent
     *
     * @return void
     * @throws ApiException
     */
    public function setContent(string $filePath, string $newContent): void
    {
        $result = file_put_contents($filePath, $newContent);
        if (false === $result) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "L'écriture dans le fichier $filePath a échoué.");
        }
    }

    /**
     * @param string $needle
     *
     * @return int
     * @throws ApiException
     */
    public function getPosition(string $filePath, string $needle, bool $firstOccurrence = true): int
    {
        $content = $this->getContent($filePath);

        if ($firstOccurrence) {
            $position = strpos($content, $needle);
        } else {
            $position = strrpos($content, $needle);
        }

        if (false === $position) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "'$needle' n'a pas été trouvé dans le fichier $this->filePath.");
        }

        return $position;
    }

    /**
     * @param string $folderPath
     *
     * @return int
     * @throws ApiException
     */
    public function getNbOfFolders(string $folderPath): int
    {
        $folder = new \DirectoryIterator($folderPath);
        $foldersNb = 0;

        foreach ($folder as $node) {
            if ($node->isDot()) {
                continue;
            }
            
            if ($node->isFile()) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, Zip::ZIP_FIRST_DIR_REQUIRED);
            }

            if ($node->isDir()) {
                $name = $node->getBasename();
                $foldersNb++;
            }
        }
    }

    public function copy(string $filePath, string $target, bool $force = true): void
    {
        $this->fs->copy($filePath, $target, $force);
    }

    public function mirror(string $filePath, string $target): void
    {
        $this->fs->mirror($filePath, $target);
    }

    public function mkdir(string $filePath, int $mode = 0755): void
    {
        $this->fs->mkdir($filePath, $mode);
    }

    public function remove(string $filePath): void
    {
        $this->fs->remove($filePath);
    }
}