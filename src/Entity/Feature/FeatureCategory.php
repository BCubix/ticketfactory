<?php

namespace App\Entity\Feature;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Repository\FeatureCategoryRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FeatureCategoryRepository::class)]
class FeatureCategory extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_feature_category_all', 'a_feature_category_one', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de la catégorie doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de la catégorie doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_feature_category_all', 'a_feature_category_one', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Gedmo\Slug(fields: ['name'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_feature_category_all', 'a_feature_category_one', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_feature_category_all', 'a_feature_category_one', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $keyword = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_feature_category_all', 'a_feature_category_one', 'a_feature_all', 'a_feature_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[ORM\OneToMany(mappedBy: 'featureCategory', targetEntity: Feature::class, orphanRemoval: true)]
    private Collection $features;

    #[JMS\Expose()]
    #[JMS\Groups(['a_feature_category_all', 'a_feature_category_one', 'a_feature_all', 'a_feature_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;


    public function __construct()
    {
        $this->features = new ArrayCollection();
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
     * @return Collection<int, Feature>
     */
    public function getFeatures(): Collection
    {
        return $this->features;
    }

    public function addFeature(Feature $feature): self
    {
        if (!$this->features->contains($feature)) {
            $this->features->add($feature);
            $feature->setFeatureCategory($this);
        }

        return $this;
    }

    public function removeFeature(Feature $feature): self
    {
        if ($this->features->removeElement($feature)) {
            // set the owning side to null (unless already changed)
            if ($feature->getFeatureCategory() === $this) {
                $feature->setFeatureCategory(null);
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
