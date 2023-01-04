<?php

namespace App\Entity\Event;

use App\Entity\Datable;
use App\Repository\EventCategoryRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[Gedmo\Tree(type: 'nested')]
#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: EventCategoryRepository::class)]
class EventCategory extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de la catégorie doit être inférieure à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de la catégorie doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[Gedmo\Slug(fields: ['name'], updatable: false)]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

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
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private $parent;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    #[ORM\OrderBy(['lft' => 'ASC'])]
    private $children;

    #[ORM\OneToMany(mappedBy: 'mainCategory', targetEntity: Event::class)]
    private $mainEvents;

    #[ORM\ManyToMany(targetEntity: Event::class, mappedBy: 'eventCategories')]
    private $events;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    public $frontUrl;


    public function __construct()
    {
        $this->children   = new ArrayCollection();
        $this->mainEvents = new ArrayCollection();
        $this->events     = new ArrayCollection();
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

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;

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

    /**
     * @return Collection<int, Event>
     */
    public function getMainEvents(): Collection
    {
        return $this->mainEvents;
    }

    public function addMainEvent(Event $mainEvent): self
    {
        if (!$this->mainEvents->contains($mainEvent)) {
            $this->mainEvents[] = $mainEvent;
            $mainEvent->setMainCategory($this);
        }

        return $this;
    }

    public function removeMainEvent(Event $mainEvent): self
    {
        if ($this->mainEvents->removeElement($mainEvent)) {
            // set the owning side to null (unless already changed)
            if ($mainEvent->getMainCategory() === $this) {
                $mainEvent->setMainCategory(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): self
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
            $event->addEventCategory($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            $event->removeEventCategory($this);
        }

        return $this;
    }
}
