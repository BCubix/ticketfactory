<?php

namespace App\Entity\Event;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Entity\SEOAble\SEOAble;
use App\Repository\EventRepository;
use App\Service\Sorter\EventSorter;

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
#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    use SEOAble;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one', 'a_tag_all', 'a_tag_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de l\'événement doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de l\'événement doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one', 'a_tag_all', 'a_tag_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[Gedmo\Slug(fields: ['name'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\NotBlank(message: 'Le chapô doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $chapo = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private $description;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins un bloc de dates.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventDateBlock::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventDateBlocks;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins un bloc de tarifs.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventPriceBlock::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventPriceBlocks;

    #[Assert\NotNull(message: 'La catégorie principale de l\'événement doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventMedia::class, orphanRemoval: true,  cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $eventMedias;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne(targetEntity: EventCategory::class, inversedBy: 'mainEvents')]
    private $mainCategory;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\ManyToMany(targetEntity: EventCategory::class, inversedBy: 'events')]
    private $eventCategories;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne(targetEntity: Room::class, inversedBy: 'events')]
    private $room;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne(targetEntity: Season::class, inversedBy: 'events')]
    private $season;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne(inversedBy: 'events')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'events')]
    private $tags;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    public $frontUrl;

    public function __construct()
    {
        /*** > Module: ModuleTCE ***/
        $this->spectacleBlogs = new ArrayCollection();
        $this->spectaclePresses = new ArrayCollection();
        $this->spectacleFroms = new ArrayCollection();
        $this->spectacleTos = new ArrayCollection();
        $this->spectacleTags = new ArrayCollection();
        /*** < Module: ModuleTCE ***/
        $this->eventCategories  = new ArrayCollection();
        $this->eventDateBlocks  = new ArrayCollection();
        $this->eventPriceBlocks = new ArrayCollection();
        $this->eventMedias      = new ArrayCollection();
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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
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

    /**
    * Renvoie la première date de représentation de l'événement
    *
    * @return EventDate
    */
    #[JMS\Expose()]
    #[JMS\VirtualProperty()]
    #[JMS\SerializedName("beginDate")]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    public function getBeginDate($objectString = EventSorter::STRING_DATE)
    {
        return EventSorter::getReferenceDate($this, EventSorter::FIRST_DATE, $objectString);
    }

    /**
    * Renvoie la dernière date de représentation du spectacle
    *
    * @return Datetime
    */
    #[JMS\Expose()]
    #[JMS\VirtualProperty()]
    #[JMS\SerializedName("endDate")]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    public function getEndDate($objectString = EventSorter::STRING_DATE)
    {
        return EventSorter::getReferenceDate($this, EventSorter::LAST_DATE, $objectString);
    }

   /**
    * Renvoie le media principal associé à l'évenement
    *
    * @return Media
    */
    public function getMainMedia()
    {
        foreach ($this->getEventMedias() as $eventMedia) {
            if ($eventMedia->isMainImg()) {
                return $eventMedia->getMedia();
            }
        }

        foreach ($this->getEventMedias() as $eventMedia) {
            if ($eventMedia->getRealType() == 'image') {
                return $eventMedia->getMedia();
            }
        }

        return null;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function completeSeo() {
        $this->completeFields($this->getName());
    }
}
