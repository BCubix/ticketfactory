<?php

namespace App\Utils;

use App\Exception\ApiException;

use Symfony\Component\HttpFoundation\Response;

class FileManipulator
{
    private $content;
    private $filePath;

    public function __construct(string $filePath)
    {
        $content = file_get_contents($filePath);
        if (false === $content) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
                "La lecture du fichier $filePath a échoué.");
        }

        $this->content = $content;
        $this->filePath = $filePath;
    }

    /**
     * @return string
     */
    public function getContent(): string
    {
        return $this->content;
    }

    /**
     * @param string $newContent
     *
     * @return void
     * @throws ApiException
     */
    public function setContent(string $newContent): void
    {
        $result = file_put_contents($this->filePath, $newContent);
        if (false === $result) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "L'écriture dans le fichier $this->filePath a échoué.");
        }
        $this->content = $newContent;
    }

    /**
     * @param string $needle
     *
     * @return int
     * @throws ApiException
     */
    public function getPosition(string $needle): int
    {
        $position = strpos($this->content, $needle);
        if (false === $position) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "'$needle' n'a pas été trouvé dans le fichier $this->filePath.");
        }
        return $position;
    }
}