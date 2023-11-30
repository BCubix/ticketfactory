<?php

namespace App\Entity\Feature;

use App\Entity\Datable;
use App\Entity\Event\Event;
use App\Entity\Product\Product;
use App\Repository\FeatureRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FeatureRepository::class)]
class Feature extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 123)]
    private ?string $slug = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $keyword = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\Column]
    private ?int $position = null;

    #[ORM\Column]
    private ?bool $filter = null;

    #[ORM\Column(length: 255)]
    private ?string $filterType = null;

    #[ORM\OneToMany(mappedBy: 'feature', targetEntity: FeatureValue::class, orphanRemoval: true)]
    private Collection $featureValues;

    #[ORM\ManyToOne(inversedBy: 'features')]
    #[ORM\JoinColumn(nullable: false)]
    private ?FeatureCategory $featureCategory = null;

    #[ORM\OneToMany(mappedBy: 'feature', targetEntity: FeatureLink::class, orphanRemoval: true)]
    private Collection $featureLinks;

    public function __construct()
    {
        $this->featureValues = new ArrayCollection();
        $this->featureLinks = new ArrayCollection();
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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getKeyword(): ?string
    {
        return $this->keyword;
    }

    public function setKeyword(?string $keyword): self
    {
        $this->keyword = $keyword;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
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

    public function isFilter(): ?bool
    {
        return $this->filter;
    }

    public function setFilter(bool $filter): self
    {
        $this->filter = $filter;

        return $this;
    }

    public function getFilterType(): ?string
    {
        return $this->filterType;
    }

    public function setFilterType(string $filterType): self
    {
        $this->filterType = $filterType;

        return $this;
    }

    /**
     * @return Collection<int, FeatureValue>
     */
    public function getFeatureValues(): Collection
    {
        return $this->featureValues;
    }

    public function addFeatureValue(FeatureValue $featureValue): self
    {
        if (!$this->featureValues->contains($featureValue)) {
            $this->featureValues->add($featureValue);
            $featureValue->setFeature($this);
        }

        return $this;
    }

    public function removeFeatureValue(FeatureValue $featureValue): self
    {
        if ($this->featureValues->removeElement($featureValue)) {
            // set the owning side to null (unless already changed)
            if ($featureValue->getFeature() === $this) {
                $featureValue->setFeature(null);
            }
        }

        return $this;
    }

    public function getFeatureCategory(): ?FeatureCategory
    {
        return $this->featureCategory;
    }

    public function setFeatureCategory(?FeatureCategory $featureCategory): self
    {
        $this->featureCategory = $featureCategory;

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
            $featureLink->setFeature($this);
        }

        return $this;
    }

    public function removeFeatureLink(FeatureLink $featureLink): self
    {
        if ($this->featureLinks->removeElement($featureLink)) {
            // set the owning side to null (unless already changed)
            if ($featureLink->getFeature() === $this) {
                $featureLink->setFeature(null);
            }
        }

        return $this;
    }
}
