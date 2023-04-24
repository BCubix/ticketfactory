<?php

use App\Event\Admin\HookEvent;
use App\Service\ModuleTheme\Config\ModuleConfig;

class ModuleTest4Config extends ModuleConfig
{
    protected const NAME = 'ModuleTest4';
    protected const DISPLAY_NAME = 'ModuleTest4';
    protected const DESCRIPTION = 'The ModuleTest4';
    protected const AUTHOR = 'Ticket Factory';
    protected const VERSION = '1.0.0';

    protected const HOOKS = [ 'Hello', 'Euuuh', 'Toto' ];

    public function hookHello(HookEvent $event)
    {
        echo 'Hello from ModuleTest4 param:' . $event->getParams()[0] .'<br>';
    }

    public function hookEuuuh()
    {
        echo 'euuuh from ModuleTest4<br>';
    }

    public function hookToto()
    {
        echo 'toto from ModuleTest4<br>';
    }
}