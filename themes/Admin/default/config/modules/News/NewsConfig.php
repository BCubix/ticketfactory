<?php

use App\Entity\Media\Media;
use App\Event\Admin\HookEvent;
use App\Service\ModuleTheme\Config\ModuleConfig;
use TicketFactory\Module\News\Entity\News\MediaTrait;

class NewsConfig extends ModuleConfig
{
    protected const NAME = 'News';
    protected const DISPLAY_NAME = 'Actualités';
    protected const DESCRIPTION = 'La liste des actualités';
    protected const AUTHOR = 'Ticket Factory';
    protected const VERSION = '1.0.0';

    protected const TABLES = [ 'news_block', 'news' ];

    protected const TRAITS = [
        Media::class => [
            MediaTrait::class
        ]
    ];

    protected const HOOKS = [ 'Hello', 'Euuuh', 'Toto' ];

    public function hookHello(HookEvent $event)
    {
        echo '<textarea name="MyData">Hello ' . $event->getParams()[0] . ' from NewsConfig.</textarea></br>';
    }

    public function hookEuuuh()
    {
        echo '<h1>Bienvenue de la part du module News !!</h1>';
        echo '<input name="Euuuh" value="Euuuh de NewsConfig" />';
    }

    public function hookToto()
    {
        $loader = new \Twig\Loader\FilesystemLoader(__DIR__);
        $twig = new \Twig\Environment($loader);

        echo $twig->render('news.html.twig');
    }
}