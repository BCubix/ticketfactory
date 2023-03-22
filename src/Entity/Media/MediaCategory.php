<?php

namespace App\Entity\Media;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Repository\MediaCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[Gedmo\Tree(type: 'nested')]
#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: MediaCategoryRepository::class)]
class MediaCategory extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_one', 'a_media_category_all', 'a_media_category_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de la catégorie de média doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de la catégorie de média doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_media_one', 'a_media_category_all', 'a_media_category_one'])]
    #[ORM\Column(type: Types::STRING, length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_one', 'a_media_category_all', 'a_media_category_one'])]
    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $shortDescription = null;

    #[Gedmo\Slug(fields: ['name'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_article_one', 'a_media_one', 'a_media_category_all', 'a_media_category_one'])]
    #[ORM\Column(type: Types::STRING, length: 123, unique: true)]
    private $slug;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_one', 'a_media_category_all', 'a_media_category_one'])]
    #[ORM\Column]
    private ?int $position = 0;

    #[Gedmo\TreeLeft]
    #[ORM\Column(type: Types::INTEGER)]
    private $lft;

    #[Gedmo\TreeRight]
    #[ORM\Column(type: Types::INTEGER)]
    private $rgt;

    #[Gedmo\TreeLevel]
    #[ORM\Column(type: Types::INTEGER)]
    private $lvl;

    #[Gedmo\TreeRoot]
    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: 'tree_root', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private $root;

    #[Gedmo\TreeParent]
    #[JMS\Expose()]
    #[JMS\Groups(['a_media_category_all', 'a_media_category_one'])]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private $parent;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_category_all', 'a_media_category_one'])]
    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    #[ORM\OrderBy(['lft' => 'ASC'])]
    private $children;

    #[ORM\OneToMany(mappedBy: 'mainCategory', targetEntity: Media::class)]
    private $mainMedias;

    #[ORM\ManyToMany(targetEntity: Media::class, mappedBy: 'mediaCategories')]
    private $medias;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_category_all', 'a_media_category_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class, inversedBy: 'mediaCategories')]
    #[ORM\JoinColumn(nullable: false)]
    private $lang;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_category_all', 'a_media_category_one'])]
    #[ORM\Column(type: 'uuid')]
    private $languageGroup;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_category_all', 'a_media_category_one'])]
    public $frontUrl;

    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->mainMedias = new ArrayCollection();
        $this->medias = new ArrayCollection();
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

    public function getShortDescription(): ?string
    {
        return $this->shortDescription;
    }

    public function setShortDescription(?string $shortDescription): self
    {
        $this->shortDescription = $shortDescription;

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

    public function getLft(): ?int
    {
        return $this->lft;
    }

    public function getRgt(): ?int
    {
        return $this->rgt;
    }

    public function getLvl(): ?int
    {
        return $this->lvl;
    }

    public function getRoot(): ?self
    {
        return $this->root;
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
     * @return Collection<int, Media>
     */
    public function getMainMedias(): Collection
    {
        return $this->mainMedias;
    }

    public function addMainMedia(Media $mainMedia): self
    {
        if (!$this->mainMedias->contains($mainMedia)) {
            $this->mainMedias->add($mainMedia);
            $mainMedia->setMainCategory($this);
        }

        return $this;
    }

    public function removeMainMedia(Media $mainMedia): self
    {
        if ($this->mainMedias->removeElement($mainMedia)) {
            // set the owning side to null (unless already changed)
            if ($mainMedia->getMainCategory() === $this) {
                $mainMedia->setMainCategory(null);
            }
        }

        return $this;
    }

    public function resetMainMedias(): self
    {
        $this->mainMedias = new ArrayCollection();

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedias(): Collection
    {
        return $this->medias;
    }

    public function addMedia(Media $media): self
    {
        if (!$this->medias->contains($media)) {
            $this->medias->add($media);
            $media->addMediaCategory($this);
        }

        return $this;
    }

    public function removeMedia(Media $media): self
    {
        if ($this->medias->removeElement($media)) {
            $media->removeMediaCategory($this);
        }

        return $this;
    }

    public function resetMedias(): self
    {
        $this->medias = new ArrayCollection();

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

    public function getLanguageGroup(): ?Uuid
    {
        return $this->languageGroup;
    }

    public function setLanguageGroup(Uuid $languageGroup): self
    {
        $this->languageGroup = $languageGroup;

        return $this;
    }
}
