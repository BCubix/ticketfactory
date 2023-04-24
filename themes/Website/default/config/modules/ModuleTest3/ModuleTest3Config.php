<?php

use App\Event\Admin\HookEvent;
use App\Service\ModuleTheme\Config\ModuleConfig;

class ModuleTest3Config extends ModuleConfig
{
    protected const NAME = 'ModuleTest3';
    protected const DISPLAY_NAME = 'ModuleTest3';
    protected const DESCRIPTION = 'The ModuleTest3';
    protected const AUTHOR = 'Ticket Factory';
    protected const VERSION = '1.0.0';

    protected const HOOKS = [ 'Hello', 'Euuuh', 'Toto' ];

    public function hookHello(HookEvent $event)
    {
        echo 'Hello from ModuleTest3 param:' . $event->getParams()[0] .'<br>';
    }

    public function hookEuuuh()
    {
        echo 'euuuh from ModuleTest3<br>';
    }

    public function hookToto()
    {
        echo 'toto from ModuleTest3<br>';
    }
}