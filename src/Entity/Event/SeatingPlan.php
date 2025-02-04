<?php

namespace App\Entity\Event;

use App\Entity\Language\Language;
use App\Repository\SeatingPlanRepository;

use Doctrine\Common\Collections\ArrayCollection;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: SeatingPlanRepository::class)]
class SeatingPlan
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_room_all', 'a_room_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du plan doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du plan doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_all', 'a_room_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[ORM\ManyToOne(targetEntity: Room::class, inversedBy: 'seatingPlans')]
    #[ORM\JoinColumn(nullable: false)]
    private $room;

    #[JMS\Expose()]
    #[JMS\Groups(['a_room_one', 'a_room_all'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins une catégorie de tarifs.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_room_one', 'a_room_all'])]
    #[ORM\OneToMany(mappedBy: 'seatingPlan', targetEntity: EventPriceCategory::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventPriceCategories;

    public function __construct()
    {
        $this->eventPriceCategories = new ArrayCollection();
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

    public function getRoom(): ?Room
    {
        return $this->room;
    }

    public function setRoom(?Room $room): self
    {
        $this->room = $room;

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
            $eventPriceCategory->setSeatingPlan($this);
        }

        return $this;
    }

    public function removeEventPriceCategory(EventPriceCategory $eventPriceCategory): self
    {
        if ($this->eventPriceCategories->removeElement($eventPriceCategory)) {
            if ($eventPriceCategory->getSeatingPlan() === $this) {
                $eventPriceCategory->setSeatingPlan(null);
            }
        }

        return $this;
    }
}
