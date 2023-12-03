<?php

namespace App\Entity\Feature;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Repository\FeatureRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FeatureRepository::class)]
class Feature extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de l\'attribut doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de l\'attribut doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Gedmo\Slug(fields: ['name'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $keyword = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column]
    private ?int $position = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column]
    private ?bool $filter = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $filterType = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_feature_category_all', 'a_feature_category_one', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\OneToMany(mappedBy: 'feature', targetEntity: FeatureValue::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $featureValues;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\ManyToOne(inversedBy: 'features')]
    #[ORM\JoinColumn(nullable: false)]
    private ?FeatureCategory $featureCategory = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_all', 'a_feature_one'])]
    #[ORM\OneToMany(mappedBy: 'feature', targetEntity: FeatureLink::class, orphanRemoval: true)]
    private Collection $featureLinks;

    #[JMS\Expose()]
    #[JMS\Groups(['a_feature_category_all', 'a_feature_category_one', 'a_feature_all', 'a_feature_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

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

    public function getLanguageGroup(): ?Uuid
    {
        return $this->languageGroup;
    }

    public function setLanguageGroup(?Uuid $languageGroup): self
    {
        $this->languageGroup = $languageGroup;

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

    public function getLang(): ?Language
    {
        return $this->lang;
    }

    public function setLang(?Language $lang): self
    {
        $this->lang = $lang;

        return $this;
    }
}
