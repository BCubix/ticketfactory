<?php

namespace App\Entity;

use App\Repository\EventRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event extends Datable
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

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private $description;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventDate::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    private $eventDates;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'event', targetEntity: EventPrice::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    private $eventPrices;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: EventCategory::class, inversedBy: 'events')]
    private $eventCategory;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: Room::class, inversedBy: 'events')]
    private $room;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: Season::class, inversedBy: 'events')]
    private $season;


    public function __construct()
    {
        $this->eventDates  = new ArrayCollection();
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
     * @return Collection<int, EventDate>
     */
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
            // set the owning side to null (unless already changed)
            if ($eventDate->getEvent() === $this) {
                $eventDate->setEvent(null);
            }
        }

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
            $eventPrice->setEvent($this);
        }

        return $this;
    }

    public function removeEventPrice(EventPrice $eventPrice): self
    {
        if ($this->eventPrices->removeElement($eventPrice)) {
            // set the owning side to null (unless already changed)
            if ($eventPrice->getEvent() === $this) {
                $eventPrice->setEvent(null);
            }
        }

        return $this;
    }

    public function getEventCategory(): ?EventCategory
    {
        return $this->eventCategory;
    }

    public function setEventCategory(?EventCategory $eventCategory): self
    {
        $this->eventCategory = $eventCategory;

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
}
