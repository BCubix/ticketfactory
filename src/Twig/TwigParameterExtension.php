<?php

namespace App\Twig;

use App\Manager\ParameterManager;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigParameterExtension extends AbstractExtension
{
    protected $pm;

    public function __construct(ParameterManager $pm)
    {
       $this->pm = $pm;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('parameter', [$this, 'parameter'])
        ];
    }

    public function parameter(string $parameterKey)
    {
        return $this->pm->get($parameterKey);
    }
}
