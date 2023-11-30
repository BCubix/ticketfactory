<?php

namespace App\Entity\Feature;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class FeatureValue
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $value = null;

    #[ORM\Column]
    private ?bool $custom = null;

    #[ORM\ManyToOne(inversedBy: 'featureValues')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Feature $feature = null;

    #[ORM\OneToMany(mappedBy: 'featureValue', targetEntity: FeatureLink::class, orphanRemoval: true)]
    private Collection $featureLinks;

    public function __construct()
    {
        $this->featureLinks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function isCustom(): ?bool
    {
        return $this->custom;
    }

    public function setCustom(bool $custom): self
    {
        $this->custom = $custom;

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

    /**
     * @return Collection<int, FeatureLink>
     */
    public function getFeatureLinks(): Collection
    {
        return $this->featureLinks;
    }

    public function addFeatureLink(FeatureLink $featureLink): self
    {
        if (!$this->featureLinks->contains($featureLink)) {
            $this->featureLinks->add($featureLink);
            $featureLink->setFeatureValue($this);
        }

        return $this;
    }

    public function removeFeatureLink(FeatureLink $featureLink): self
    {
        if ($this->featureLinks->removeElement($featureLink)) {
            // set the owning side to null (unless already changed)
            if ($featureLink->getFeatureValue() === $this) {
                $featureLink->setFeatureValue(null);
            }
        }

        return $this;
    }
}
