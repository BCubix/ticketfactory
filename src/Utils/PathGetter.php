<?php

namespace App\Utils;

class PathGetter
{
    private $projectDir;

    public function __construct(string $projectDir)
    {
        $this->projectDir = $projectDir;
    }

    public function getProjectDir(): string
    {
        return $this->projectDir . '/';
    }

    public function getPublicDir(): string
    {
        return $this->projectDir . '/public/';
    }

    public function getModulesDir(): string
    {
        return $this->projectDir . '/modules';
    }

    public function getThemesDir(): string
    {
        return $this->projectDir . '/themes/Website';
    }

    public function getHooksDir(): string
    {
        return $this->projectDir . '/src/Hook';
    }
}
