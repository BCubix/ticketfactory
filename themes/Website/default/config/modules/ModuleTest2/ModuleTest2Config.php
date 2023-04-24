<?php

use App\Event\Admin\HookEvent;
use App\Service\ModuleTheme\Config\ModuleConfig;

class ModuleTest2Config extends ModuleConfig
{
    protected const NAME = 'ModuleTest2';
    protected const DISPLAY_NAME = 'ModuleTest2';
    protected const DESCRIPTION = 'The ModuleTest2';
    protected const AUTHOR = 'Ticket Factory';
    protected const VERSION = '1.0.0';

    protected const HOOKS = [ 'Hello', 'Euuuh', 'Toto' ];

    public function hookHello(HookEvent $event)
    {
        echo 'Hello from ModuleTest2 param:' . $event->getParams()[0] .'<br>';
    }

    public function hookEuuuh()
    {
        echo 'euuuh from ModuleTest2<br>';
    }

    public function hookToto()
    {
        echo 'toto from ModuleTest2<br>';
    }
}