<?php

namespace App\Service\File;

class PathGetter
{
    public const SERVICE_NAME = 'pathGetter';

    private const PROJECT_DIR = '/';
    private const PUBLIC_DIR  = 'public';
    private const MODULE_DIR  = 'modules';
    private const THEME_DIR   = 'themes/Website';
    private const MANAGER_DIR = 'src/Manager';
    private const SERVICE_DIR = 'src/Service';
    private const HOOK_DIR    = 'src/Hook';

    protected $projectDir;

    public function __construct(string $projectDir)
    {
        $this->projectDir = $projectDir;
    }

    public function getProjectDir(): string
    {
        return $this->projectDir . static::PROJECT_DIR;
    }

    public function getPublicDir(): string
    {
        return $this->getProjectDir() . static::PUBLIC_DIR;
    }

    public function getModulesDir(): string
    {
        return $this->getProjectDir() . static::MODULE_DIR;
    }

    public function getThemesDir(): string
    {
        return $this->getProjectDir() . static::THEME_DIR;
    }

    public function getManagerDir(): string
    {
        return $this->getProjectDir() . static::MANAGER_DIR;
    }

    public function getServiceDir(): string
    {
        return $this->getProjectDir() . static::SERVICE_DIR;
    }

    public function getHooksDir(): string
    {
        return $this->getProjectDir() . static::HOOK_DIR;
    }
}
