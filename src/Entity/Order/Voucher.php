<?php

namespace App\Entity\Order;

use App\Entity\Datable;
use App\Repository\VoucherRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: VoucherRepository::class)]
class Voucher extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    const DISCOUNT_TYPE = [
        "€" => 'Euros',
        "%" => "Pour cent"
    ];

    #[JMS\Expose()]
    #[JMS\Groups(['a_voucher_all', 'a_voucher_one', 'a_cart_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du bon de réduction doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du bon de réduction doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_voucher_all', 'a_voucher_one', 'a_cart_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Assert\Length(max: 50, maxMessage: 'Le code du bon de réduction doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le code du bon de réduction doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_voucher_all', 'a_voucher_one', 'a_cart_one'])]
    #[ORM\Column(length: 255)]
    private ?string $code = null;

    #[Assert\NotBlank(message: 'Le montant de la réduction doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_voucher_all', 'a_voucher_one', 'a_cart_one'])]
    #[ORM\Column]
    private ?float $discount = null;

    #[Assert\NotBlank(message: "l'unité de la réduction doit être renseigné.")]
    #[JMS\Expose()]
    #[JMS\Groups(['a_voucher_all', 'a_voucher_one', 'a_cart_one'])]
    #[ORM\Column(length: 255)]
    private ?string $unit = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_voucher_all', 'a_voucher_one', 'a_cart_one'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $beginDate = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_voucher_all', 'a_voucher_one', 'a_cart_one'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\ManyToMany(targetEntity: Cart::class, inversedBy: 'vouchers')]
    private Collection $carts;

    #[ORM\ManyToMany(targetEntity: CartRow::class, inversedBy: 'vouchers')]
    private Collection $cartRows;

    public function __construct()
    {
        $this->carts = new ArrayCollection();
        $this->cartRows = new ArrayCollection();
    }

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

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getDiscount(): ?float
    {
        return $this->discount;
    }

    public function setDiscount(float $discount): self
    {
        $this->discount = $discount;

        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(string $unit): self
    {
        $this->unit = $unit;

        return $this;
    }

    public function getBeginDate(): ?\DateTimeInterface
    {
        return $this->beginDate;
    }

    public function setBeginDate(?\DateTimeInterface $beginDate): self
    {
        $this->beginDate = $beginDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeInterface $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * @return Collection<int, Cart>
     */
    public function getCarts(): Collection
    {
        return $this->carts;
    }

    public function addCart(Cart $cart): self
    {
        if (!$this->carts->contains($cart)) {
            $this->carts->add($cart);
        }

        return $this;
    }

    public function removeCart(Cart $cart): self
    {
        $this->carts->removeElement($cart);

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
        }

        return $this;
    }

    public function removeCartRow(CartRow $cartRow): self
    {
        $this->cartRows->removeElement($cartRow);

        return $this;
    }
}
