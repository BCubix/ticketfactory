<?php

namespace App\Utils;

class FileManipulator
{
    private $content;
    private $filePath;

    public function __construct(string $filePath)
    {
        $content = file_get_contents($filePath);
        if (false === $content) {
            throw new \Exception("Erreur lors de la lecture du fichier $filePath.");
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
     * @throws \Exception
     */
    public function setContent(string $newContent)
    {
        $result = file_put_contents($this->filePath, $newContent);
        if (false === $result) {
            throw new \Exception("Erreur lors de l'écriture dans le fichier $this->filePath.");
        }
        $this->content = $newContent;
    }

    /**
     * @param string $needle
     *
     * @return int
     * @throws \Exception
     */
    public function getPosition(string $needle): int
    {
        $position = strpos($this->content, $needle);
        if (false === $position) {
            throw new \Exception("'$needle' n'a pas trouvé dans le fichier $this->filePath.");
        }
        return $position;
    }
}