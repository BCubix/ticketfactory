<?php

namespace App\Entity\Event;

use App\Entity\Language\Language;
use App\Repository\EventPriceCategoryRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: EventPriceCategoryRepository::class)]
#[Assert\Expression(
    "this.getEvent() !== null or this.getSeatingPlan() !== null",
    message: "Soit event, soit seatingPlan doit être fourni.."
)]
class EventPriceCategory
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du bloc doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du bloc doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins un tarif.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_one',  'a_room_all'])]
    #[ORM\OneToMany(mappedBy: 'eventPriceCategory', targetEntity: EventPrice::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventPrices;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_one', 'a_room_all'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_one', 'a_room_all'])]
    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'eventPriceCategories')]
    #[ORM\JoinColumn(nullable: true)]
    private $event;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_one', 'a_room_all'])]
    #[ORM\ManyToOne(targetEntity: SeatingPlan::class, inversedBy: 'eventPriceCategories')]
    #[ORM\JoinColumn(nullable: true)]
    private $seatingPlan;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\ManyToOne(targetEntity: EventDate::class, inversedBy: 'eventPriceCategories', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?EventDate $eventDate = null;

    public function __construct()
    {
        $this->eventPrices = new ArrayCollection();
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

    /**
     * @return Collection<int, EventPrice>
     */
    public function getEventPrices(): Collection
    {
        return $this->eventPrices;
    }

    public function addEventPrice(EventPrice $eventPrice): self
    {
        if (!$this->eventPrices->contains($eventPrice)) {
            $this->eventPrices[] = $eventPrice;
            $eventPrice->setEventPriceCategory($this);
        }

        return $this;
    }

    public function removeEventPrice(EventPrice $eventPrice): self
    {
        if ($this->eventPrices->removeElement($eventPrice)) {
            // set the owning side to null (unless already changed)
            if ($eventPrice->getEventPriceCategory() === $this) {
                $eventPrice->setEventPriceCategory(null);
            }
        }

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

    public function getSeatingPlan(): ?SeatingPlan
    {
        return $this->seatingPlan;
    }

    public function setSeatingPlan(?SeatingPlan $seatingPlan): self
    {
        $this->seatingPlan = $seatingPlan;
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

    public function getEventDate(): ?EventDate
    {
        return $this->eventDate;
    }

    public function setEventDate(?EventDate $eventDate): self
    {
        $this->eventDate = $eventDate;

        return $this;
    }

    public function toStringToCompare(): array
    {
        $result =  [
            'name' => $this->name,
            'eventPrices' => []
        ];

        foreach ($this->eventPrices as $eventPrice) {
            $result['eventPrices'][] = $eventPrice->toStringToCompare();
        }

        return $result;
    }

    public function restoreHistory(array $fields): self
    {
        if (isset($fields['name'])) {
            $this->name = $fields['name'];
        }

        if (isset($fields['eventPrices'])) {
            foreach ($fields['eventPrices'] as $key => $value) {
                if (isset($this->eventPrices[$key])) {
                    $this->eventPrices[$key] = $this->eventPrices[$key]->restoreHistory($value);
                }
            }
        }

        return $this;
    }
}
