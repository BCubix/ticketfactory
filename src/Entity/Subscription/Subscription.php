<?php

namespace App\Entity\Subscription;

use App\Entity\Datable;
use App\Entity\Event\Event;
use App\Entity\Language\Language;
use App\Repository\SubscriptionRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use JMS\Serializer\Annotation as JMS;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: SubscriptionRepository::class)]
class Subscription extends Datable
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $eventNb = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\Column]
    private ?float $price = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_season_all', 'a_season_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $beginDate = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $endDate = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $duration = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    /**
     * @var Collection<int, Event>
     */
    #[JMS\Expose()]
    #[JMS\Groups(['a_subscription_all', 'a_subscription_one'])]
    #[ORM\ManyToMany(targetEntity: Event::class, inversedBy: 'subscriptions')]
    private Collection $events;


    public function __construct()
    {
        $this->events = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getEventNb(): ?int
    {
        return $this->eventNb;
    }

    public function setEventNb(int $eventNb): static
    {
        $this->eventNb = $eventNb;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

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

    public function getBeginDate(): ?\DateTimeInterface
    {
        return $this->beginDate;
    }

    public function setBeginDate(?\DateTimeInterface $beginDate): static
    {
        $this->beginDate = $beginDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeInterface $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
        }

        return $this;
    }

    public function removeEvent(Event $event): static
    {
        $this->events->removeElement($event);

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
