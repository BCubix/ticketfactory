<?php

namespace App\Entity\Order;

use App\Entity\Customer\Address;
use App\Entity\Customer\Customer;
use App\Entity\Datable;
use App\Repository\CartRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: CartRepository::class)]
class Cart extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Column]
    private ?float $total = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Column(nullable: true)]
    private ?float $deliveryPrice = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $ticketingReference = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\OneToOne(mappedBy: 'cart', cascade: ['persist'])]
    private ?Order $linkedOrder = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\OneToOne(mappedBy: 'cart', cascade: ['persist', 'remove'])]
    private ?Address $address = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\OneToMany(mappedBy: 'cart', targetEntity: EventRow::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $eventRows;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\OneToMany(mappedBy: 'cart', targetEntity: ProductRow::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $productRows;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\OneToMany(mappedBy: 'cart', targetEntity: SubscriptionRow::class, orphanRemoval: true)]
    private Collection $subscriptionRows;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToOne(inversedBy: 'carts')]
    private ?Customer $customer = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\ManyToOne]
    private ?DeliveryMode $deliveryMode = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToMany(targetEntity: Voucher::class, mappedBy: 'carts')]
    private Collection $vouchers;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    public $discount = 0;

    public function __construct()
    {
        $this->eventRows = new ArrayCollection();
        $this->vouchers = new ArrayCollection();
        $this->productRows = new ArrayCollection();
        $this->subscriptionRows = new ArrayCollection();
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

    public function getDeliveryPrice(): ?float
    {
        return $this->deliveryPrice;
    }

    public function setDeliveryPrice(?float $deliveryPrice): static
    {
        $this->deliveryPrice = $deliveryPrice;

        return $this;
    }

    public function getTicketingReference(): ?int
    {
        return $this->ticketingReference;
    }

    public function setTicketingReference(?int $ticketingReference): self
    {
        $this->ticketingReference = $ticketingReference;

        return $this;
    }

    public function getLinkedOrder(): ?Order
    {
        return $this->linkedOrder;
    }

    public function setLinkedOrder(Order $linkedOrder): self
    {
        // set the owning side of the relation if necessary
        if ($linkedOrder->getCart() !== $this) {
            $linkedOrder->setCart($this);
        }

        $this->linkedOrder = $linkedOrder;

        return $this;
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): static
    {
        // unset the owning side of the relation if necessary
        if ($address === null && $this->address !== null) {
            $this->address->setCart(null);
        }

        // set the owning side of the relation if necessary
        if ($address !== null && $address->getCart() !== $this) {
            $address->setCart($this);
        }

        $this->address = $address;

        return $this;
    }

    /**
     * @return Collection<int, EventRow>
     */
    public function getEventRows(): Collection
    {
        return $this->eventRows;
    }

    public function addEventRow(EventRow $eventRow): self
    {
        if (!$this->eventRows->contains($eventRow)) {
            $this->eventRows->add($eventRow);
            $eventRow->setCart($this);
        }

        return $this;
    }

    public function removeEventRow(EventRow $eventRow): self
    {
        if ($this->eventRows->removeElement($eventRow)) {
            // set the owning side to null (unless already changed)
            if ($eventRow->getCart() === $this) {
                $eventRow->setCart(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ProductRow>
     */
    public function getProductRows(): Collection
    {
        return $this->productRows;
    }

    public function addProductRow(ProductRow $productRow): static
    {
        if (!$this->productRows->contains($productRow)) {
            $this->productRows->add($productRow);
            $productRow->setCart($this);
        }

        return $this;
    }

    public function removeProductRow(ProductRow $productRow): static
    {
        if ($this->productRows->removeElement($productRow)) {
            // set the owning side to null (unless already changed)
            if ($productRow->getCart() === $this) {
                $productRow->setCart(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SubscriptionRow>
     */
    public function getSubscriptionRows(): Collection
    {
        return $this->subscriptionRows;
    }

    public function addSubscriptionRow(SubscriptionRow $subscriptionRow): static
    {
        if (!$this->subscriptionRows->contains($subscriptionRow)) {
            $this->subscriptionRows->add($subscriptionRow);
            $subscriptionRow->setCart($this);
        }

        return $this;
    }

    public function removeSubscriptionRow(SubscriptionRow $subscriptionRow): static
    {
        if ($this->subscriptionRows->removeElement($subscriptionRow)) {
            // set the owning side to null (unless already changed)
            if ($subscriptionRow->getCart() === $this) {
                $subscriptionRow->setCart(null);
            }
        }

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getDeliveryMode(): ?DeliveryMode
    {
        return $this->deliveryMode;
    }

    public function setDeliveryMode(?DeliveryMode $deliveryMode): static
    {
        $this->deliveryMode = $deliveryMode;

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
            $voucher->addCart($this);
        }

        return $this;
    }

    public function removeVoucher(Voucher $voucher): self
    {
        if ($this->vouchers->removeElement($voucher)) {
            $voucher->removeCart($this);
        }

        return $this;
    }
}
