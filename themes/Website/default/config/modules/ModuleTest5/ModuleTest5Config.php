<?php

use App\Event\Admin\HookEvent;
use App\Service\ModuleTheme\Config\ModuleConfig;

class ModuleTest5Config extends ModuleConfig
{
    protected const NAME = 'ModuleTest5';
    protected const DISPLAY_NAME = 'ModuleTest5';
    protected const DESCRIPTION = 'The ModuleTest5';
    protected const AUTHOR = 'Ticket Factory';
    protected const VERSION = '1.0.0';

    protected const HOOKS = [ 'Hello', 'Euuuh', 'Toto' ];

    public function hookHello(HookEvent $event)
    {
        echo 'Hello from ModuleTest5 param:' . $event->getParams()[0] .'<br>';
    }

    public function hookEuuuh()
    {
        echo 'euuuh from ModuleTest5<br>';
    }

    public function hookToto()
    {
        echo 'toto from ModuleTest5<br>';
    }
}