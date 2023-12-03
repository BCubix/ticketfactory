<?php

namespace App\Entity\Feature;

use App\Entity\Event\Event;
use App\Entity\Product\Product;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[ORM\Entity]
class FeatureLink
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'featureLinks')]
    private ?Event $event = null;

    #[ORM\ManyToOne(inversedBy: 'feature')]
    private ?Product $product = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one', 'a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne(inversedBy: 'featureLinks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Feature $feature = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one', 'a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne(inversedBy: 'featureLinks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?FeatureValue $featureValue = null;

    private ?string $featureValueRaw = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getFeature(): ?Feature
    {
        return $this->feature;
    }

    public function setFeature(?Feature $feature): self
    {
        $this->feature = $feature;

        return $this;
    }

    public function getFeatureValue(): ?FeatureValue
    {
        return $this->featureValue;
    }

    public function setFeatureValue(?FeatureValue $featureValue): self
    {
        $this->featureValue = $featureValue;

        return $this;
    }

    public function getFeatureValueRaw(): ?string
    {
        return $this->featureValueRaw;
    }

    public function setFeatureValueRaw(string $featureValueRaw): self
    {
        $this->featureValueRaw = $featureValueRaw;

        return $this;
    }
}
