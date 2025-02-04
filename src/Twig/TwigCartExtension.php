<?php

namespace App\Twig;

use App\Entity\Order\Cart;
use App\Entity\Order\EventRow;
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
            new TwigFunction('getEventSeatsGrouped', [$this, 'getEventSeatsGrouped']),
            new TwigFunction('getCart', [$this, 'getCart']),
            new TwigFunction('getDiscount', [$this, 'getDiscount']),
        ];
    }

    public function getEventSeatsGrouped(EventRow $eventRow): ?array
    {
        return $this->cm->getEventSeatsGrouped($eventRow);
    }

    public function getCart(): ?Cart
    {
        return $this->cm->getCart();
    }

    public function getDiscount(): ?int
    {
        return $this->cm->calculateDiscount($this->getCart());
    }
}
