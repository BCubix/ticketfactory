<?php

use App\Event\Admin\HookEvent;
use App\Service\ModuleTheme\Config\ModuleConfig;

class InfoConfig extends ModuleConfig
{
    protected const NAME = 'Info';
    protected const DISPLAY_NAME = 'Informations';
    protected const DESCRIPTION = 'La liste des informations';
    protected const AUTHOR = 'Jeanne Cai';
    protected const VERSION = '1.0.0';

    protected const TABLES = [ 'info' ];

    protected const HOOKS = [ 'Hello', 'Euuuh', 'Toto' ];

    public function hookHello(HookEvent $event)
    {
        echo 'Hello from InfoConfig param:' . $event->getParams()[0] .'<br>';
    }

    public function hookEuuuh()
    {
        echo 'euuuh from InfoConfig<br>';
    }

    public function hookToto()
    {
        echo 'toto from InfoConfig<br>';
    }
}