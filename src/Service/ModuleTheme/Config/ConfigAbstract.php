<?php

namespace App\Service\ModuleTheme\Config;

abstract class ConfigAbstract
{
    protected const NAME = null;

    protected $projectDir;
    protected $path;

    public function __construct(string $projectDir, string $dir)
    {
        if (null === static::NAME) {
            throw new \InvalidArgumentException("Veuillez renseigner le nom dans le fichier de configuration du dossier $dir.");
        }

        $this->projectDir = $projectDir;
        $this->path = $dir . '/' . static::NAME;
    }

    protected abstract function install();
    protected abstract function uninstall();
}