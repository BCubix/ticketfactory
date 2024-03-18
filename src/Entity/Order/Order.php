<?php

namespace App\Entity\Order;

use App\Entity\Customer\Customer;
use App\Repository\OrderRepository;
use App\Entity\Datable;

use JMS\Serializer\Annotation as JMS;
use Doctrine\ORM\Mapping as ORM;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order extends Datable
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_order_all', 'a_order_one', 'a_cart_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_all', 'a_order_one', 'a_cart_one'])]
    #[ORM\Column(length: 32)]
    private ?string $reference = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_all', 'a_order_one', 'a_cart_one'])]
    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?OrderStatus $status = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_all', 'a_order_one'])]
    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Customer $customer = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_all', 'a_order_one'])]
    #[ORM\OneToOne(inversedBy: 'linkedOrder', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Cart $cart = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_all', 'a_order_one'])]
    #[ORM\Column(nullable: true)]
    private ?array $orderData = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
    {
        $this->reference = $reference;

        return $this;
    }

    public function getStatus(): ?OrderStatus
    {
        return $this->status;
    }

    public function setStatus(?OrderStatus $status): self
    {
        $this->status = $status;

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

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(Cart $cart): self
    {
        $this->cart = $cart;

        return $this;
    }

    public function getOrderData(): ?array
    {
        return $this->orderData;
    }

    public function setOrderData(?array $orderData): static
    {
        $this->orderData = $orderData;

        return $this;
    }
}
