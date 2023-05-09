<?php

namespace App\Twig;

use App\Manager\MenuEntryManager;
use App\Service\Url\UrlService;

use Symfony\Component\Routing\RouterInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigPathExtension extends AbstractExtension
{
    protected $us;
    protected $mm;

    public function __construct(UrlService $us, MenuEntryManager $mm)
    {
       $this->us = $us;
       $this->mm = $mm;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('menuPath', [$this, 'menuPath']),
            new TwigFunction('keywordPath', [$this, 'keywordPath']),
            new TwigFunction('orchestratorPath', [$this, 'orchestratorPath'])
        ];
    }

    public function menuPath(array $menu, $params = [], $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        return $this->mm->getMenuUrl($menu, $params, $absolute);
    }

    public function keywordPath(string $keyword, $params = [], $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        return $this->us->keywordPath($keyword, $params, $absolute);
    }

    public function orchestratorPath(mixed $element, $params = [], $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        return $this->us->tfPath($element, $params, $absolute);
    }
}
