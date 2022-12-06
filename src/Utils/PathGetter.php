<?php

namespace App\Utils;

class PathGetter
{
    private $projectDir;

    public function __construct(string $projectDir)
    {
        $this->projectDir = $projectDir;
    }

    public function getProjectDir()
    {
        return $this->projectDir . '/';
    }

    public function getPublicDir() {
        return $this->projectDir . '/public/';
    }
}
