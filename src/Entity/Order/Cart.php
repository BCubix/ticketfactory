<?php

namespace App\Entity\Order;

use App\Entity\Customer\Customer;
use App\Repository\CartRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: CartRepository::class)]
class Cart extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one'])]
    #[ORM\ManyToOne(inversedBy: 'carts')]
    private ?Customer $customer = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one'])]
    #[ORM\OneToMany(mappedBy: 'cart', targetEntity: CartRow::class, orphanRemoval: true)]
    private Collection $cartRows;
    

    public function __construct()
    {
        $this->cartRows = new ArrayCollection();
    }
    

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return Collection<int, CartRow>
     */
    public function getCartRows(): Collection
    {
        return $this->cartRows;
    }

    public function addCartRow(CartRow $cartRow): self
    {
        if (!$this->cartRows->contains($cartRow)) {
            $this->cartRows->add($cartRow);
            $cartRow->setCart($this);
        }

        return $this;
    }

    public function removeCartRow(CartRow $cartRow): self
    {
        if ($this->cartRows->removeElement($cartRow)) {
            // set the owning side to null (unless already changed)
            if ($cartRow->getCart() === $this) {
                $cartRow->setCart(null);
            }
        }

        return $this;
    }
}
