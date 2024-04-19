<?php

namespace App\Entity\Order;

use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\SeatingPlan;
use App\Repository\CartRowRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: CartRowRepository::class)]
class CartRow
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Column]
    private ?float $total = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Event $event = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'], orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?EventDate $eventDate = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToOne]
    private ?SeatingPlan $seatingPlan = null;

    #[ORM\ManyToOne(inversedBy: 'cartRows')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Cart $cart = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\OneToMany(mappedBy: 'cartRow', targetEntity: CartSeat::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $cartSeats;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToMany(targetEntity: Voucher::class, mappedBy: 'cartRows')]
    private Collection $vouchers;


    public function __construct()
    {
        $this->vouchers = new ArrayCollection();
        $this->cartSeats = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
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

    public function getEvent(): ?Event
    {
        return $this->event;
    }

    public function setEvent(?Event $event): self
    {
        $this->event = $event;

        return $this;
    }

    public function getEventDate(): ?EventDate
    {
        return $this->eventDate;
    }

    public function setEventDate(?EventDate $eventDate): self
    {
        $this->eventDate = $eventDate;

        return $this;
    }

    public function getSeatingPlan(): ?SeatingPlan
    {
        return $this->seatingPlan;
    }

    public function setSeatingPlan(?SeatingPlan $seatingPlan): self
    {
        $this->seatingPlan = $seatingPlan;

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

    /**
     * @return Collection<int, CartSeat>
     */
    public function getCartSeats(): Collection
    {
        return $this->cartSeats;
    }

    public function addCartSeat(CartSeat $cartSeat): self
    {
        if (!$this->cartSeats->contains($cartSeat)) {
            $this->cartSeats->add($cartSeat);
            $cartSeat->setCartRow($this);
        }

        return $this;
    }

    public function removeCartSeat(CartSeat $cartSeat): self
    {
        if ($this->cartSeats->removeElement($cartSeat)) {
            // set the owning side to null (unless already changed)
            if ($cartSeat->getCartRow() === $this) {
                $cartSeat->setCartRow(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Voucher>
     */
    public function getVouchers(): Collection
    {
        return $this->vouchers;
    }

    public function addVoucher(Voucher $voucher): self
    {
        if (!$this->vouchers->contains($voucher)) {
            $this->vouchers->add($voucher);
            $voucher->addCartRow($this);
        }

        return $this;
    }

    public function removeVoucher(Voucher $voucher): self
    {
        if ($this->vouchers->removeElement($voucher)) {
            $voucher->removeCartRow($this);
        }

        return $this;
    }
}
