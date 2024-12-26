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
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $eventLength = null;

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
    public $frontUrl;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one'])]
    public $frontBookingButton = true;

    #[ORM\ManyToOne(inversedBy: 'events')]
    private ?Subscription $subscription = null;

    /**
     * @var Collection<int, Subscription>
     */
    #[ORM\ManyToMany(targetEntity: Subscription::class, mappedBy: 'events')]
    private Collection $subscriptions;

    public function __construct()
    {
        $this->eventCategories  = new ArrayCollection();
        $this->eventDateBlocks  = new ArrayCollection();
        $this->eventPriceBlocks = new ArrayCollection();
        $this->eventMedias      = new ArrayCollection();
        $this->tags             = new ArrayCollection();
        $this->featureLinks     = new ArrayCollection();
        $this->subscriptions = new ArrayCollection();
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

    public function getSubscription(): ?Subscription
    {
        return $this->subscription;
    }

    public function setSubscription(?Subscription $subscription): static
    {
        $this->subscription = $subscription;

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
}
