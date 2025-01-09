<?php

namespace App\Entity\Event;

use App\Entity\Language\Language;
use App\Entity\Order\EventRow;
use App\Entity\Event\Event;
use App\Repository\EventDateRepository;
use App\Validation\Constraint\EventDateConstraint;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[EventDateConstraint]
#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: EventDateRepository::class)]
class EventDate
{
    /*** > Trait ***/
    /*** < Trait ***/

    const STATES = [
        'valid'    => 'Valide',
        'delayed'  => 'Reporté',
        'canceled' => 'Annulé',
        'new_date' => 'Nouvelle date'
    ];

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    private ?string $eventDateUuid = null;

    #[Assert\GreaterThan(value: "1970-01-01", message: 'Vous devez renseigner une date valide.')]
    #[Assert\NotBlank(message: 'La date doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one'])]
    #[ORM\Column(type: 'datetime')]
    private $eventDate;

    #[Assert\Choice(callback: 'getStateKeys', message: 'Vous devez renseigner un statut valide.')]
    #[Assert\NotBlank(message: 'Le statut doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one'])]
    #[ORM\Column(type: 'string', length: 15, nullable: true)]
    private $state;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one'])]
    #[ORM\Column(type: 'datetime', nullable: true)]
    private $reportDate;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $annotation;

    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'eventDates')]
    #[ORM\JoinColumn(nullable: false)]
    private $event;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'eventDate', targetEntity: EventRow::class, orphanRemoval: true, cascade: ["remove"])]
    private Collection $eventRows;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'eventDate', targetEntity: EventPriceCategory::class, cascade: ['persist', 'remove'])]
    private Collection $eventPriceCategories;

    private ?string $eventDateUuid = null;


    public function __construct()
    {
        $this->eventRows = new ArrayCollection();
        $this->eventPriceCategories = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getEventDateUuid(): string
    {
        return $this->eventDateUuid;
    }

    public function setEventDateUuid(string $eventDateUuid): self
    {
        $this->eventDateUuid = $eventDateUuid;
        return $this;
    }

    public function getEventDate(): ?\DateTimeInterface
    {
        return $this->eventDate;
    }

    public function setEventDate(\DateTimeInterface $eventDate): self
    {
        $this->eventDate = $eventDate;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getReportDate(): ?\DateTimeInterface
    {
        return $this->reportDate;
    }

    public function setReportDate(?\DateTimeInterface $reportDate): self
    {
        $this->reportDate = $reportDate;

        return $this;
    }

    public function getAnnotation(): ?string
    {
        return $this->annotation;
    }

    public function setAnnotation(?string $annotation): self
    {
        $this->annotation = $annotation;

        return $this;
    }

    public function getStateKeys()
    {
        return array_keys(self::STATES);
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

    public function getEvent(): ?Event
    {
        return $this->event;
    }

    public function setEvent(?Event $event): self
    {
        $this->event = $event;

        return $this;
    }

    /**
     * @return Collection<int, EventRow>
     */
    public function getEventRows(): Collection
    {
        return $this->eventRows;
    }

    public function addEventRow(EventRow $eventRow): static
    {
        if (!$this->eventRows->contains($eventRow)) {
            $this->eventRows->add($eventRow);
            $eventRow->setEventDate($this);
        }

        return $this;
    }

    public function removeEventRow(EventRow $eventRow): static
    {
        if ($this->eventRows->removeElement($eventRow)) {
            // set the owning side to null (unless already changed)
            if ($eventRow->getEventDate() === $this) {
                $eventRow->setEventDate(null);
            }
        }

        return $this;
    }

    public function getEventPriceCategories(): Collection
    {
        return $this->eventPriceCategories;
    }

    public function addEventPriceCategory(EventPriceCategory $eventPriceCategory): self
    {
        if (!$this->eventPriceCategories->contains($eventPriceCategory)) {
            $this->eventPriceCategories[] = $eventPriceCategory;
            $eventPriceCategory->setEventDate($this);
        }

        return $this;
    }

    public function removeEventPriceCategory(EventPriceCategory $eventPriceCategory): self
    {
        if ($this->eventPriceCategories->removeElement($eventPriceCategory)) {
            if ($eventPriceCategory->getEventDate() === $this) {
                $eventPriceCategory->setEventDate(null);
            }
        }

        return $this;
    }

    public function getEventDateUuid(): string
    {
        return $this->eventDateUuid;
    }

    public function setEventDateUuid(string $eventDateUuid): self
    {
        $this->eventDateUuid = $eventDateUuid;
        return $this;
    }

    public function toStringToCompare(): array
    {
        $result = [
            'eventDate'             => $this->eventDate ? $this->eventDate->format('Y-m-d H:i:s') : null,
            'state'                 => $this->state,
            'reportDate'            => $this->reportDate ? $this->reportDate->format('Y-m-d H:i:s') : null,
            'annotation'            => $this->annotation,
            'eventPriceCategories'  => []
        ];

        foreach($this->eventPriceCategories as $eventPriceCategory) {
            $result['eventPriceCategories'][] = $eventPriceCategory->toStringToCompare();
        }

        return $result;
    }

    public function restoreHistory(array $fields): self
    {
        $simpleFields = [
            'state', 'annotation',
        ];
        foreach ($simpleFields as $field) {
            if (isset($fields[$field])) {
                $this->$field = $fields[$field];
            }
        }

        $dateFields = [
            'eventDate' => 'eventDate',
            'reportDate' => 'reportDate',
        ];
        foreach ($dateFields as $field => $property) {
            if (isset($fields[$field]) && $fields[$field] !== null) {
                $this->$property = \DateTime::createFromFormat('Y-m-d H:i:s', $fields[$field]);
            }
        }

        return $this;
    }
}
