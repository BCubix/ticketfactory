<?php

namespace App\Entity\Event;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity]
class EventDateBlock
{
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du bloc doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du bloc doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins une date.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'eventDateBlock', targetEntity: EventDate::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    private $eventDates;

    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'eventDateBlocks')]
    #[ORM\JoinColumn(nullable: false)]
    private $event;


    public function __construct()
    {
        $this->eventDates = new ArrayCollection();
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
            $eventDate->setEventDateBlock($this);
        }

        return $this;
    }

    public function removeEventDate(EventDate $eventDate): self
    {
        if ($this->eventDates->removeElement($eventDate)) {
            // set the owning side to null (unless already changed)
            if ($eventDate->getEventDateBlock() === $this) {
                $eventDate->setEventDateBlock(null);
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
}
