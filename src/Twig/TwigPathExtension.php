<?php

namespace App\Twig;

use App\Manager\MenuEntryManager;
use App\Service\ServiceFactory;

use Symfony\Component\Routing\RouterInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigPathExtension extends AbstractExtension
{
    protected $sf;
    protected $mm;

    public function __construct(ServiceFactory $sf, MenuEntryManager $mm)
    {
        $this->sf = $sf;
        $this->mm = $mm;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('menuPath', [$this, 'menuPath']),
            new TwigFunction('keywordPath', [$this, 'keywordPath']),
            new TwigFunction('tfPath', [$this, 'tfPath'])
        ];
    }

    public function menuPath(array $menu, $params = [], $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        return $this->mm->getMenuUrl($menu, $params, $absolute);
    }

    public function keywordPath(string $keyword, $params = [], $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        return $this->sf->get('urlService')->keywordPath($keyword, $params, $absolute);
    }

    public function tfPath(mixed $element, $params = [], $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        return $this->sf->get('urlService')->tfPath($element, $params, $absolute);
    }
}
