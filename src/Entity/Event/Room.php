<?php

namespace App\Entity\Event;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Repository\RoomRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: RoomRepository::class)]
class Room extends Datable
{
    /*** > Trait ***/
    /*** > Module: ModuleTCE ***/
    use \TicketFactory\Module\ModuleTCE\Entity\Traits\Spectacle\RoomTrait;
    /*** < Module: ModuleTCE ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de la salle doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de la salle doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[Gedmo\Slug(fields: ['name'], updatable: false)]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\PositiveOrZero(message: 'Le nombre de sièges de la salle doit être un nombre supérieur ou égal à 0.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private $seatsNb;

    #[Assert\PositiveOrZero(message: 'La surface de la salle doit être un nombre supérieur ou égal à 0.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private $area;

    #[Assert\Valid]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'room', targetEntity: SeatingPlan::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    private $seatingPlans;

    #[ORM\OneToMany(mappedBy: 'room', targetEntity: Event::class)]
    private $events;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(inversedBy: 'rooms')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    public $frontUrl;

    public function __construct()
    {
        /*** > Module: ModuleTCE ***/
        /*** < Module: ModuleTCE ***/
        $this->seatingPlans = new ArrayCollection();
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

    public function getSeatsNb(): ?int
    {
        return $this->seatsNb;
    }

    public function setSeatsNb(?int $seatsNb): self
    {
        $this->seatsNb = $seatsNb;

        return $this;
    }

    public function getArea(): ?int
    {
        return $this->area;
    }

    public function setArea(?int $area): self
    {
        $this->area = $area;

        return $this;
    }

    /**
     * @return Collection<int, SeatingPlan>
     */
    public function getSeatingPlans(): Collection
    {
        return $this->seatingPlans;
    }

    public function addSeatingPlan(SeatingPlan $seatingPlan): self
    {
        if (!$this->seatingPlans->contains($seatingPlan)) {
            $this->seatingPlans[] = $seatingPlan;
            $seatingPlan->setRoom($this);
        }

        return $this;
    }

    public function removeSeatingPlan(SeatingPlan $seatingPlan): self
    {
        if ($this->seatingPlans->removeElement($seatingPlan)) {
            // set the owning side to null (unless already changed)
            if ($seatingPlan->getRoom() === $this) {
                $seatingPlan->setRoom(null);
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
            $event->setRoom($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getRoom() === $this) {
                $event->setRoom(null);
            }
        }

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
