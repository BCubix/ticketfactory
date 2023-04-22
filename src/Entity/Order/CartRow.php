<?php

namespace App\Entity\Order;

use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventPrice;
use App\Entity\Event\SeatingPlan;
use App\Repository\CartRowRepository;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: CartRowRepository::class)]
class CartRow
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Event $eventId = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?EventDate $eventDateId = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?EventPrice $eventPriceId = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\ManyToOne]
    private ?SeatingPlan $seatingPlanId = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\Column]
    private array $names = [];

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\Column]
    private ?float $unitPrice = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\Column]
    private ?int $quantity = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\Column]
    private ?float $total = null;

    #[ORM\ManyToOne(inversedBy: 'cartRows')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Cart $cart = null;
    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEventId(): ?Event
    {
        return $this->eventId;
    }

    public function setEventId(?Event $eventId): self
    {
        $this->eventId = $eventId;

        return $this;
    }

    public function getEventDateId(): ?EventDate
    {
        return $this->eventDateId;
    }

    public function setEventDateId(?EventDate $eventDateId): self
    {
        $this->eventDateId = $eventDateId;

        return $this;
    }

    public function getEventPriceId(): ?EventPrice
    {
        return $this->eventPriceId;
    }

    public function setEventPriceId(?EventPrice $eventPriceId): self
    {
        $this->eventPriceId = $eventPriceId;

        return $this;
    }

    public function getSeatingPlanId(): ?SeatingPlan
    {
        return $this->seatingPlanId;
    }

    public function setSeatingPlanId(?SeatingPlan $seatingPlanId): self
    {
        $this->seatingPlanId = $seatingPlanId;

        return $this;
    }

    public function getNames(): array
    {
        return $this->names;
    }

    public function setNames(array $names): self
    {
        $this->names = $names;

        return $this;
    }

    public function getUnitPrice(): ?float
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(float $unitPrice): self
    {
        $this->unitPrice = $unitPrice;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getTotal(): ?float
    {
        return $this->total;
    }

    public function setTotal(float $total): self
    {
        $this->total = $total;

        return $this;
    }

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): self
    {
        $this->cart = $cart;

        return $this;
    }
}
