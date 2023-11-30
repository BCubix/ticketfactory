<?php

namespace App\Entity\Product;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Entity\SEOAble\SEOAble;
use App\Repository\ProductCategoryRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[Gedmo\Tree(type: 'nested')]
#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: ProductCategoryRepository::class)]
class ProductCategory extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    use SEOAble;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_product_all', 'a_product_one', 'a_product_category_all', 'a_product_category_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de la catégorie doit être inférieure à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de la catégorie doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_product_all', 'a_product_one', 'a_product_category_all', 'a_product_category_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_category_all', 'a_product_category_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Gedmo\Slug(fields: ['name'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_product_category_all', 'a_product_category_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_category_all', 'a_product_category_one'])]
    #[ORM\Column]
    private ?int $position = 0;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_category_all', 'a_product_category_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $keyword = null;

    #[Gedmo\TreeLeft]
    #[ORM\Column]
    private ?int $lft = null;

    #[Gedmo\TreeRight]
    #[ORM\Column]
    private ?int $rgt = null;

    #[Gedmo\TreeLevel]
    #[ORM\Column]
    private ?int $lvl = null;

    #[Gedmo\TreeRoot]
    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: 'tree_root', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private ?self $root = null;

    #[Gedmo\TreeParent]
    #[JMS\Expose()]
    #[JMS\Groups(['a_product_category_all', 'a_product_category_one'])]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private ?self $parent = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_category_all', 'a_product_category_one'])]
    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    #[ORM\OrderBy(['lft' => 'ASC'])]
    private Collection $children;

    #[ORM\OneToMany(mappedBy: 'mainCategory', targetEntity: Product::class)]
    private Collection $mainProducts;

    #[ORM\ManyToMany(targetEntity: Product::class, mappedBy: 'productCategories')]
    private Collection $products;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_category_all', 'a_product_category_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_product_category_all', 'a_product_category_one'])]
    public $frontUrl;

    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->mainProducts = new ArrayCollection();
        $this->products = new ArrayCollection();
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

    public function getLanguageGroup(): ?Uuid
    {
        return $this->languageGroup;
    }

    public function setLanguageGroup(?Uuid $languageGroup): self
    {
        $this->languageGroup = $languageGroup;

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

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

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

    public function getLft(): ?int
    {
        return $this->lft;
    }

    public function setLft(int $lft): self
    {
        $this->lft = $lft;

        return $this;
    }

    public function getRgt(): ?int
    {
        return $this->rgt;
    }

    public function setRgt(int $rgt): self
    {
        $this->rgt = $rgt;

        return $this;
    }

    public function getLvl(): ?int
    {
        return $this->lvl;
    }

    public function setLvl(int $lvl): self
    {
        $this->lvl = $lvl;

        return $this;
    }

    public function getRoot(): ?self
    {
        return $this->root;
    }

    public function setRoot(?self $root): self
    {
        $this->root = $root;

        return $this;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): self
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function addChild(self $child): self
    {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
            $child->setParent($this);
        }

        return $this;
    }

    public function removeChild(self $child): self
    {
        if ($this->children->removeElement($child)) {
            // set the owning side to null (unless already changed)
            if ($child->getParent() === $this) {
                $child->setParent(null);
            }
        }

        return $this;
    }

    public function setChildren(ArrayCollection $children): self
    {
        $this->children = $children;

        return $this;
    }

    public function resetChildren(): self
    {
        $this->children = new ArrayCollection();

        return $this;
    }

    /**
     * @return Collection<int, Product>
     */
    public function getMainProducts(): Collection
    {
        return $this->mainProducts;
    }

    public function addMainProduct(Product $mainProduct): self
    {
        if (!$this->mainProducts->contains($mainProduct)) {
            $this->mainProducts->add($mainProduct);
            $mainProduct->setMainCategory($this);
        }

        return $this;
    }

    public function removeMainProduct(Product $mainProduct): self
    {
        if ($this->mainProducts->removeElement($mainProduct)) {
            // set the owning side to null (unless already changed)
            if ($mainProduct->getMainCategory() === $this) {
                $mainProduct->setMainCategory(null);
            }
        }

        return $this;
    }

    public function resetMainProducts(): self
    {
        $this->mainProducts = new ArrayCollection();

        return $this;
    }

    /**
     * @return Collection<int, Product>
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Product $product): self
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
        }

        return $this;
    }

    public function removeProduct(Product $product): self
    {
        $this->products->removeElement($product);

        return $this;
    }

    public function resetProducts(): self
    {
        $this->products = new ArrayCollection();

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
}
