<?php

namespace App\Twig;

use App\Entity\Order\CartRow;
use App\Manager\CartManager;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigCartExtension extends AbstractExtension
{
    protected $cm;

    public function __construct(CartManager $cm)
    {
        $this->cm  = $cm;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('getCartSeatsGrouped', [$this, 'getCartSeatsGrouped']),
        ];
    }

    public function getCartSeatsGrouped(CartRow $cartRow): ?array
    {
        return $this->cm->getCartSeatsGrouped($cartRow);
    }
}
