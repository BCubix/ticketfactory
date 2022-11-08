<?php

namespace App\Entity\Event;

use App\Entity\Datable;
use App\Repository\RoomRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: RoomRepository::class)]
class Room extends Datable
{
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[Gedmo\Slug(fields: ['name'])]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private $seatsNb;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private $area;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'room', targetEntity: SeatingPlan::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    private $seatingPlans;

    #[ORM\OneToMany(mappedBy: 'room', targetEntity: Event::class)]
    private $events;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    public $frontUrl;


    public function __construct()
    {
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
}
