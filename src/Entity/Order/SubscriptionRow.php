<?php

namespace App\Entity\Order;

use App\Entity\Subscription\Subscription;
use App\Entity\Subscription\SubscriptionUsage;
use App\Repository\SubscriptionRowRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: SubscriptionRowRepository::class)]
class SubscriptionRow
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
    #[ORM\Column]
    private ?int $quantity = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Subscription $subscription = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToOne(inversedBy: 'subscriptionRows')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Cart $cart = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToMany(targetEntity: Voucher::class)]
    private Collection $vouchers;

    /**
     * @var Collection<int, SubscriptionUsage>
     */
    #[ORM\OneToMany(mappedBy: 'subscriptionRow', targetEntity: SubscriptionUsage::class, orphanRemoval: true)]
    private Collection $subscriptionUsages;

    public function __construct()
    {
        $this->vouchers = new ArrayCollection();
        $this->subscriptionUsages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotal(): ?float
    {
        return $this->total;
    }

    public function setTotal(float $total): static
    {
        $this->total = $total;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getSubscription(): ?Subscription
    {
        return $this->subscription;
    }

    public function setSubscription(?Subscription $subscription): static
    {
        $this->subscription = $subscription;

        return $this;
    }

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): static
    {
        $this->cart = $cart;

        return $this;
    }

    /**
     * @return Collection<int, Voucher>
     */
    public function getVouchers(): Collection
    {
        return $this->vouchers;
    }

    public function addVoucher(Voucher $voucher): static
    {
        if (!$this->vouchers->contains($voucher)) {
            $this->vouchers->add($voucher);
        }

        return $this;
    }

    public function removeVoucher(Voucher $voucher): static
    {
        $this->vouchers->removeElement($voucher);

        return $this;
    }

    /**
     * @return Collection<int, SubscriptionUsage>
     */
    public function getSubscriptionUsages(): Collection
    {
        return $this->subscriptionUsages;
    }

    public function addSubscriptionUsage(SubscriptionUsage $subscriptionUsage): static
    {
        if (!$this->subscriptionUsages->contains($subscriptionUsage)) {
            $this->subscriptionUsages->add($subscriptionUsage);
            $subscriptionUsage->setSubscriptionRow($this);
        }

        return $this;
    }

    public function removeSubscriptionUsage(SubscriptionUsage $subscriptionUsage): static
    {
        if ($this->subscriptionUsages->removeElement($subscriptionUsage)) {
            // set the owning side to null (unless already changed)
            if ($subscriptionUsage->getSubscriptionRow() === $this) {
                $subscriptionUsage->setSubscriptionRow(null);
            }
        }

        return $this;
    }
}
