<?php

namespace App\Entity\Product;

use App\Entity\Media\Media;
use App\Repository\ProductMediaRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: ProductMediaRepository::class)]
class ProductMedia
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_one'])]
    #[ORM\Column]
    private ?int $position = null;

    #[ORM\ManyToOne(inversedBy: 'productMedias')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $product = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_one'])]
    #[ORM\ManyToOne(inversedBy: 'productMedias')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Media $media = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getMedia(): ?Media
    {
        return $this->media;
    }

    public function setMedia(?Media $media): self
    {
        $this->media = $media;

        return $this;
    }
}
