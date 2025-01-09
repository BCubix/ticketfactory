<?php

namespace App\Entity\Product;

use App\Entity\Order\Order;
use App\Repository\ProductStockMovementRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[ORM\Entity(repositoryClass: ProductStockMovementRepository::class)]
class ProductStockMovement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[JMS\Groups(['a_product_one', 'a_product_stock_movement_all'])]
    private ?int $id = null;

    #[ORM\Column]
    #[JMS\Groups(['a_product_one', 'a_product_stock_movement_all'])]
    private ?int $quantity = null;

    #[ORM\Column]
    #[JMS\Groups(['a_product_one', 'a_product_stock_movement_all'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'a_productStockMovements')]
    #[ORM\JoinColumn(nullable: false)]
    #[JMS\Groups(['a_product_one', 'a_product_stock_movement_all'])]
    private ?Product $product = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[JMS\Groups(['a_product_one', 'a_product_stock_movement_all'])]
    private ?Order $order = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getOrder(): ?Order
    {
        return $this->order;
    }

    public function setOrder(?Order $order): static
    {
        $this->order = $order;
        return $this;
    }
}
