<?php

use App\Event\Admin\HookEvent;
use App\Service\ModuleTheme\Config\ModuleConfig;

class ModuleTest1Config extends ModuleConfig
{
    protected const NAME = 'ModuleTest1';
    protected const DISPLAY_NAME = 'ModuleTest1';
    protected const DESCRIPTION = 'The ModuleTest1';
    protected const AUTHOR = 'Ticket Factory';
    protected const VERSION = '1.0.0';

    protected const HOOKS = [ 'Hello', 'Euuuh', 'Toto' ];

    public function hookHello(HookEvent $event)
    {
        echo 'Hello from ModuleTest1 param:' . $event->getParams()[0] .'<br>';
    }

    public function hookEuuuh()
    {
        echo 'euuuh from ModuleTest1<br>';
    }

    public function hookToto()
    {
        echo 'toto from ModuleTest1<br>';
    }
}