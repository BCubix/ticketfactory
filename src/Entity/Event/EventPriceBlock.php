<?php

namespace App\Entity\Event;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity]
class EventPriceBlock
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
    #[ORM\OneToMany(mappedBy: 'eventPriceBlock', targetEntity: EventPrice::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    private $eventPrices;

    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'eventPriceBlocks')]
    #[ORM\JoinColumn(nullable: false)]
    private $event;


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
            $eventPrice->setEventPriceBlock($this);
        }

        return $this;
    }

    public function removeEventPrice(EventPrice $eventPrice): self
    {
        if ($this->eventPrices->removeElement($eventPrice)) {
            // set the owning side to null (unless already changed)
            if ($eventPrice->getEventPriceBlock() === $this) {
                $eventPrice->setEventPriceBlock(null);
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
