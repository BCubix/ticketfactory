<?php

namespace App\Entity\Event;

use App\Entity\Datable;
use App\Repository\EventRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de l\'événement doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de l\'événement doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[Assert\NotBlank(message: 'Le chapô doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $chapo = null;

    #[Gedmo\Slug(fields: ['name'], updatable: false)]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private $description;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins un bloc de dates.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventDateBlock::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventDateBlocks;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins un bloc de tarifs.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventPriceBlock::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventPriceBlocks;

    #[Assert\NotNull(message: 'La catégorie principale de l\'événement doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventMedia::class, orphanRemoval: true,  cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $eventMedias;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: EventCategory::class, inversedBy: 'mainEvents')]
    private $mainCategory;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToMany(targetEntity: EventCategory::class, inversedBy: 'events')]
    private $eventCategories;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: Room::class, inversedBy: 'events')]
    private $room;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: Season::class, inversedBy: 'events')]
    private $season;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'events')]
    private $tags;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    public $frontUrl;


    public function __construct()
    {
        $this->eventCategories  = new ArrayCollection();
        $this->eventDateBlocks  = new ArrayCollection();
        $this->eventPriceBlocks = new ArrayCollection();
        $this->eventMedias       = new ArrayCollection();
        $this->tags             = new ArrayCollection();
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

    public function getChapo(): ?string
    {
        return $this->chapo;
    }

    public function setChapo(?string $chapo): self
    {
        $this->chapo = $chapo;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, EventDateBlock>
     */
    public function getEventDateBlocks(): Collection
    {
        return $this->eventDateBlocks;
    }

    public function addEventDateBlock(EventDateBlock $eventDateBlock): self
    {
        if (!$this->eventDateBlocks->contains($eventDateBlock)) {
            $this->eventDateBlocks[] = $eventDateBlock;
            $eventDateBlock->setEvent($this);
        }

        return $this;
    }

    public function removeEventDateBlock(EventDateBlock $eventDateBlock): self
    {
        if ($this->eventDateBlocks->removeElement($eventDateBlock)) {
            // set the owning side to null (unless already changed)
            if ($eventDateBlock->getEvent() === $this) {
                $eventDateBlock->setEvent(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EventPriceBlock>
     */
    public function getEventPriceBlocks(): Collection
    {
        return $this->eventPriceBlocks;
    }

    public function addEventPriceBlock(EventPriceBlock $eventPriceBlock): self
    {
        if (!$this->eventPriceBlocks->contains($eventPriceBlock)) {
            $this->eventPriceBlocks[] = $eventPriceBlock;
            $eventPriceBlock->setEvent($this);
        }

        return $this;
    }

    public function removeEventPriceBlock(EventPriceBlock $eventPriceBlock): self
    {
        if ($this->eventPriceBlocks->removeElement($eventPriceBlock)) {
            // set the owning side to null (unless already changed)
            if ($eventPriceBlock->getEvent() === $this) {
                $eventPriceBlock->setEvent(null);
            }
        }

        return $this;
    }

    public function getMainCategory(): ?EventCategory
    {
        return $this->mainCategory;
    }

    public function setMainCategory(?EventCategory $mainCategory): self
    {
        $this->mainCategory = $mainCategory;

        return $this;
    }

    /**
     * @return Collection<int, EventCategory>
     */
    public function getEventCategories(): Collection
    {
        return $this->eventCategories;
    }

    public function addEventCategory(EventCategory $eventCategory): self
    {
        if (!$this->eventCategories->contains($eventCategory)) {
            $this->eventCategories[] = $eventCategory;
        }

        return $this;
    }

    public function removeEventCategory(EventCategory $eventCategory): self
    {
        $this->eventCategories->removeElement($eventCategory);

        return $this;
    }

    public function getRoom(): ?Room
    {
        return $this->room;
    }

    public function setRoom(?Room $room): self
    {
        $this->room = $room;

        return $this;
    }

    public function getSeason(): ?Season
    {
        return $this->season;
    }

    public function setSeason(?Season $season): self
    {
        $this->season = $season;

        return $this;
    }

    /**
     * @return Collection<int, Tag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): self
    {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
        }

        return $this;
    }

    public function removeTag(Tag $tag): self
    {
        $this->tags->removeElement($tag);

        return $this;
    }

    /**
     * @return Collection<int, EventMedia>
     */
    public function getEventMedias(): Collection
    {
        return $this->eventMedias;
    }

    public function addEventMedia(EventMedia $eventMedia): self
    {
        if (!$this->eventMedias->contains($eventMedia)) {
            $this->eventMedias->add($eventMedia);
            $eventMedia->setEvent($this);
        }

        return $this;
    }

    public function removeEventMedia(EventMedia $eventMedia): self
    {
        if ($this->eventMedias->removeElement($eventMedia)) {
            // set the owning side to null (unless already changed)
            if ($eventMedia->getEvent() === $this) {
                $eventMedia->setEvent(null);
            }
        }

        return $this;
    }
}
