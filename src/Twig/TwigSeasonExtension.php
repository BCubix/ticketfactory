<?php

namespace App\Twig;

use App\Manager\SeasonManager;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigSeasonExtension extends AbstractExtension
{
    protected $sm;

    public function __construct(SeasonManager $sm)
    {
       $this->sm = $sm;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('seasons', [$this, 'seasons']),
            new TwigFunction('currentSeason', [$this, 'currentSeason']),
            new TwigFunction('nextSeason', [$this, 'nextSeason'])
        ];
    }

    public function seasons()
    {
        return $this->sm->getSeasons();
    }

    public function currentSeason()
    {
        return $this->sm->getCurrentSeason();
    }

    public function nextSeason()
    {
        return $this->sm->getNextSeason();
    }
}
