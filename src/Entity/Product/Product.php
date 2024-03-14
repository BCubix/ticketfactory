<?php

namespace App\Entity\Product;

use App\Entity\Datable;
use App\Entity\Feature\FeatureLink;
use App\Entity\Language\Language;
use App\Entity\SEOAble\SEOAble;
use App\Entity\Ticketing\Ticketing;
use App\Repository\ProductRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    use SEOAble;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one', 'a_cart_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de l\'événement doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de l\'événement doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one', 'a_tag_all', 'a_tag_one', 'a_cart_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Gedmo\Slug(fields: ['name'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one', 'a_cart_one'])]
    #[ORM\Column(length: 123)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\NotBlank(message: 'Le chapô doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_product_one', 'a_cart_one'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $chapo = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_one'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one'])]
    #[ORM\Column(nullable: true)]
    private ?float $price = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one'])]
    #[ORM\ManyToOne(targetEntity: ProductCategory::class, inversedBy: 'mainProducts')]
    private ?ProductCategory $mainCategory = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_one'])]
    #[ORM\ManyToMany(targetEntity: ProductCategory::class, inversedBy: 'products')]
    private Collection $productCategories;

    #[Assert\NotNull(message: 'La catégorie principale du produit doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_product_one'])]
    #[ORM\OneToMany(mappedBy: 'product', targetEntity: ProductMedia::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $productMedias;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one'])]
    public $frontUrl;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one'])]
    #[ORM\OneToMany(mappedBy: 'product', targetEntity: FeatureLink::class, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $featureLinks;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one'])]
    #[ORM\ManyToOne]
    private ?Ticketing $ticketing = null;

    public function __construct()
    {
        $this->productCategories = new ArrayCollection();
        $this->productMedias = new ArrayCollection();
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

    public function getLanguageGroup(): ?Uuid
    {
        return $this->languageGroup;
    }

    public function setLanguageGroup(?Uuid $languageGroup): self
    {
        $this->languageGroup = $languageGroup;

        return $this;
    }

    public function getChapo(): ?string
    {
        return $this->chapo;
    }

    public function setChapo(?string $chapo): self
    {
        $this->chapo = $chapo;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getMainCategory(): ?ProductCategory
    {
        return $this->mainCategory;
    }

    public function setMainCategory(?ProductCategory $mainCategory): self
    {
        $this->mainCategory = $mainCategory;
        $this->addProductCategory($mainCategory);

        return $this;
    }

    /**
     * @return Collection<int, ProductCategory>
     */
    public function getProductCategories(): Collection
    {
        return $this->productCategories;
    }

    public function addProductCategory(ProductCategory $productCategory): self
    {
        if (!$this->productCategories->contains($productCategory)) {
            $this->productCategories->add($productCategory);
            $productCategory->addProduct($this);
        }

        return $this;
    }

    public function removeProductCategory(ProductCategory $productCategory): self
    {
        if ($this->productCategories->removeElement($productCategory)) {
            $productCategory->removeProduct($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, ProductMedia>
     */
    public function getProductMedias(): Collection
    {
        return $this->productMedias;
    }

    public function addProductMedia(ProductMedia $productMedia): self
    {
        if (!$this->productMedias->contains($productMedia)) {
            $this->productMedias->add($productMedia);
            $productMedia->setProduct($this);
        }

        return $this;
    }

    public function removeProductMedia(ProductMedia $productMedia): self
    {
        if ($this->productMedias->removeElement($productMedia)) {
            // set the owning side to null (unless already changed)
            if ($productMedia->getProduct() === $this) {
                $productMedia->setProduct(null);
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

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function completeSeo()
    {
        $this->completeFields($this->getName());
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
            $featureLink->setProduct($this);
        }

        return $this;
    }

    public function removeFeatureLink(FeatureLink $featureLink): self
    {
        if ($this->featureLinks->removeElement($featureLink)) {
            // set the owning side to null (unless already changed)
            if ($featureLink->getProduct() === $this) {
                $featureLink->setProduct(null);
            }
        }

        return $this;
    }

    public function getTicketing(): ?Ticketing
    {
        return $this->ticketing;
    }

    public function setTicketing(?Ticketing $ticketing): static
    {
        $this->ticketing = $ticketing;

        return $this;
    }
}
