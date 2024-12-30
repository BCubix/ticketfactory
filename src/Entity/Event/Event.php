<?php

namespace App\Entity\Event;

use App\Entity\Datable;
use App\Entity\Feature\FeatureLink;
use App\Entity\Language\Language;
use App\Entity\SEOAble\SEOAble;
use App\Entity\Subscription\Subscription;
use App\Entity\Ticketing\Ticketing;
use App\Repository\EventRepository;

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
    #[JMS\Groups(['a_event_all', 'a_event_one', 'a_tag_all', 'a_tag_one', 'a_cart_one', 'a_content_one', 'a_page_one', 'a_page_block_all', 'a_page_block_one', 'a_subscription_one', 'a_version_all', 'a_version_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de l\'événement doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de l\'événement doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one', 'a_tag_all', 'a_tag_one', 'a_cart_one', 'a_content_one', 'a_version_all', 'a_version_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[Gedmo\Slug(fields: ['name'], updatable: false)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one', 'a_cart_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\NotBlank(message: 'Le chapô doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $chapo = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private $description;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column(nullable: true, type: Types::TEXT)]
    private ?string $ticketingReference = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column]
    private ?bool $displayBookingButton = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $eventLength = null;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins une dates.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventDate::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventDates;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins une catégorie de tarifs.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventPriceCategory::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventPriceCategories;

    #[Assert\NotNull(message: 'La catégorie principale de l\'événement doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventMedia::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
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
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'events', cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $tags;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: FeatureLink::class, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private Collection $featureLinks;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne]
    private ?Ticketing $ticketing = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne]
    private ?EventType $eventType = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    #[ORM\ManyToOne]
    private ?SeatingPlan $seatingPlan = null;

    /**
     * @var Collection<int, Subscription>
     */
    #[ORM\ManyToMany(targetEntity: Subscription::class, mappedBy: 'events')]
    private Collection $subscriptions;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    public $frontUrl;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    public $frontBookingButton = true;


    public function __construct()
    {
        $this->eventCategories  = new ArrayCollection();
        $this->eventDates       = new ArrayCollection();
        $this->eventPriceCategories = new ArrayCollection();
        $this->eventMedias      = new ArrayCollection();
        $this->tags             = new ArrayCollection();
        $this->featureLinks     = new ArrayCollection();
        $this->subscriptions    = new ArrayCollection();
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

    public function getTicketingReference(): ?string
    {
        return $this->ticketingReference;
    }

    public function setTicketingReference(?string $ticketingReference): self
    {
        $this->ticketingReference = $ticketingReference;

        return $this;
    }

    public function isDisplayBookingButton(): ?bool
    {
        return $this->displayBookingButton;
    }

    public function setDisplayBookingButton(bool $displayBookingButton): static
    {
        $this->displayBookingButton = $displayBookingButton;

        return $this;
    }

    public function getEventLength(): ?string
    {
        return $this->eventLength;
    }

    public function setEventLength(?string $eventLength): self
    {
        $this->eventLength = $eventLength;

        return $this;
    }

    public function getEventDates(): Collection
    {
        return $this->eventDates;
    }

    public function addEventDate(EventDate $eventDate): self
    {
        if (!$this->eventDates->contains($eventDate)) {
            $this->eventDates[] = $eventDate;
            $eventDate->setEvent($this);
        }

        return $this;
    }

    public function removeEventDate(EventDate $eventDate): self
    {
        if ($this->eventDates->removeElement($eventDate)) {
            if ($eventDate->getEvent() === $this) {
                $eventDate->setEvent(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EventPriceCategory>
     */
    public function getEventPriceCategories(): Collection
    {
        return $this->eventPriceCategories;
    }

    public function addEventPriceCategory(EventPriceCategory $eventPriceCategory): self
    {
        if (!$this->eventPriceCategories->contains($eventPriceCategory)) {
            $this->eventPriceCategories[] = $eventPriceCategory;
            $eventPriceCategory->setEvent($this);
        }

        return $this;
    }

    public function removeEventPriceCategory(EventPriceCategory $eventPriceCategory): self
    {
        if ($this->eventPriceCategories->removeElement($eventPriceCategory)) {
            // set the owning side to null (unless already changed)
            if ($eventPriceCategory->getEvent() === $this) {
                $eventPriceCategory->setEvent(null);
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
        if (null !== $mainCategory) {
            $this->addEventCategory($mainCategory);
        }

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
            $featureLink->setEvent($this);
        }

        return $this;
    }

    public function removeFeatureLink(FeatureLink $featureLink): self
    {
        if ($this->featureLinks->removeElement($featureLink)) {
            // set the owning side to null (unless already changed)
            if ($featureLink->getEvent() === $this) {
                $featureLink->setEvent(null);
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

    public function getEventType(): ?EventType
    {
        return $this->eventType;
    }

    public function setEventType(?EventType $eventType): static
    {
        $this->eventType = $eventType;

        return $this;
    }

    public function getSeatingPlan(): ?SeatingPlan
    {
        return $this->seatingPlan;
    }

    public function setSeatingPlan(?SeatingPlan $seatingPlan): static
    {
        $this->seatingPlan = $seatingPlan;

        return $this;
    }

    /**
     * @return Collection<int, Subscription>
     */
    public function getSubscriptions(): Collection
    {
        return $this->subscriptions;
    }

    public function addSubscription(Subscription $subscription): static
    {
        if (!$this->subscriptions->contains($subscription)) {
            $this->subscriptions->add($subscription);
            $subscription->addEvent($this);
        }

        return $this;
    }

    public function removeSubscription(Subscription $subscription): static
    {
        if ($this->subscriptions->removeElement($subscription)) {
            $subscription->removeEvent($this);
        }

        return $this;
    }

    public function toStringToCompare(): array
    {
        $result = [
            'name'                  => $this->name,
            'slug'                  => $this->slug,
            'chapo'                 => $this->chapo,
            'description'           => $this->description,
            'ticketingReference'    => $this->ticketingReference,
            'displayBookingButton'  => $this->displayBookingButton,
            'eventLength'           => $this->eventLength,
            'eventDates'             => [],
            'eventPriceCategories'  => [],
            'eventMedias'           => [],
            'mainCategory'          => null !== $this->mainCategory ? $this->mainCategory->getId() : null,
            'eventCategories'       => [],
            'room'                  => null !== $this->room ? $this->room->getId() : null,
            'season'                => null !== $this->season ? $this->season->getId() : null,
            'tags'                  => [],
            'featureLinks'          => [],
            'ticketing'             => null !== $this->ticketing ? $this->ticketing->getId() : null,
            'eventType'             => null !== $this->eventType ? $this->eventType->getId() : null,
            'seatingPlan'           => null !== $this->seatingPlan ? $this->seatingPlan->getId() : null,
        ];

        foreach ($this->eventDates as $eventDate) {
            $result['eventDates'][] = $eventDate->toStringToCompare();
        }

        foreach ($this->eventPriceCategories as $eventPriceCategory) {
            $result['eventPriceCategories'][] = $eventPriceCategory->toStringToCompare();
        }

        foreach ($this->eventMedias as $eventMedia) {
            $result['eventMedias'][] = $eventMedia->toStringToCompare();
        }

        foreach ($this->eventCategories as $eventCategory) {
            $result['eventCategories'][] = $eventCategory->getId();
        }

        foreach ($this->tags as $tag) {
            $result['tags'][] = $tag->getId();
        }

        foreach ($this->featureLinks as $featureLink) {
            $result['featureLinks'][] = $featureLink->toStringToCompare();
        }

        return $result;
    }

    public function restoreHistory(array $fields): self
    {
        $simpleFields = [
            'name', 'slug', 'chapo', 'description',
            'ticketingReference', 'displayBookingButton',
            'eventLength'
        ];
        foreach ($simpleFields as $field) {
            if (array_key_exists($field, $fields)) {
                $this->$field = $fields[$field];
            }
        }

        $objectFields = [
            'mainCategory' => 'mainCategory',
            'room' => 'room',
            'season' => 'season',
            'ticketing' => 'ticketing',
            'eventType' => 'eventType',
            'seatingPlan' => 'seatingPlan',
        ];
        foreach ($objectFields as $field => $property) {
            if (array_key_exists($field, $fields)) {
                $this->$property = $fields[$field];
            }
        }

        $collections = [
            'eventDates' => 'eventDates',
            'eventPriceCategories' => 'eventPriceCategories',
            'eventMedias' => 'eventMedias',
            'eventCategories' => 'eventCategories',
            'tags' => 'tags',
            'featureLinks' => 'featureLinks',
        ];
        foreach ($collections as $field => $property) {
            if (array_key_exists($field, $fields)) {
                $this->$property = [];
                foreach ($fields[$field] as $key => $value) {
                    if (is_object($value) && method_exists($value, 'restoreHistory')) {
                        $this->$property[$key] = $value->restoreHistory($value);
                    } else {
                        $this->$property[$key] = $value;
                    }
                }
            }
        }

        return $this;
    }
}
