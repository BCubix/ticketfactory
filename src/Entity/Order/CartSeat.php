<?php

namespace App\Entity\Order;

use App\Entity\Event\EventPrice;
use App\Repository\CartSeatRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: CartSeatRepository::class)]
class CartSeat
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?EventPrice $eventPrice = null;

    #[ORM\ManyToOne(inversedBy: 'cartSeats')]
    #[ORM\JoinColumn(nullable: false)]
    private ?CartRow $cartRow = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getEventPrice(): ?EventPrice
    {
        return $this->eventPrice;
    }

    public function setEventPrice(?EventPrice $eventPrice): self
    {
        $this->eventPrice = $eventPrice;

        return $this;
    }

    public function getCartRow(): ?CartRow
    {
        return $this->cartRow;
    }

    public function setCartRow(?CartRow $cartRow): self
    {
        $this->cartRow = $cartRow;

        return $this;
    }
}
