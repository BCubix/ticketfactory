<?php

namespace App\Entity\Menu;

use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Entity\Event\Season;
use App\Entity\Event\Tag;
use App\Entity\Language\Language;
use App\Entity\Page\Page;
use App\Repository\MenuEntryRepository;

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
#[ORM\Entity(repositoryClass: MenuEntryRepository::class)]
class MenuEntry
{
    /*** > Trait ***/
    /*** < Trait ***/

    public const TYPES_MAPPING = [
        'event'    => Event::class,
        'category' => EventCategory::class,
        'page'     => Page::class,
        'room'     => Room::class,
        'season'   => Season::class,
        'tag'      => Tag::class,
        'external' => '',
        'none'     => ''
    ];

    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de l\'élément doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de l\'élément doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $keyword = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\Choice(callback: 'getTypesKeys', message: 'Vous devez choisir un type valide.')]
    #[Assert\NotBlank(message: 'Le type de l\'élément doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $menuType = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $value = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'boolean')]
    private $blank = false;

    #[Gedmo\TreeLeft]
    #[ORM\Column(type: 'integer')]
    private $lft;

    #[Gedmo\TreeRight]
    #[ORM\Column(type: 'integer')]
    private $rgt;

    #[Gedmo\TreeLevel]
    #[ORM\Column(type: 'integer')]
    private $lvl;

    #[Gedmo\TreeRoot]
    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: 'tree_root', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private $root;

    #[Gedmo\TreeParent]
    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private $parent;

    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_menu_all', 'a_menu_one'])]
    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    #[ORM\OrderBy(['lft' => 'ASC'])]
    private $children;


    public function __construct()
    {
        $this->children = new ArrayCollection();
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

    public function getMenuType(): ?string
    {
        return $this->menuType;
    }

    public function setMenuType(string $menuType): self
    {
        $this->menuType = $menuType;

        return $this;
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

    public function isBlank(): ?bool
    {
        return $this->blank;
    }

    public function setBlank(bool $blank): self
    {
        $this->blank = $blank;

        return $this;
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

    public function getLang(): ?Language
    {
        return $this->lang;
    }

    public function setLang(?Language $lang): self
    {
        $this->lang = $lang;

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
            $this->children[] = $child;
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

    public function resetChildren(): self
    {
        $this->children = new ArrayCollection();

        return $this;
    }

    public function getTypesKeys() {
        return array_keys(self::TYPES_MAPPING);
    }
}
