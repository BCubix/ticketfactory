<?php

namespace App\Entity\Order;

use App\Entity\Event\EventPrice;
use App\Entity\Subscription\SubscriptionUsage;
use App\Repository\EventSeatRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: EventSeatRepository::class)]
class EventSeat
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?EventPrice $eventPrice = null;

    #[ORM\ManyToOne(inversedBy: 'eventSeats')]
    #[ORM\JoinColumn(nullable: false)]
    private ?EventRow $eventRow = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_one', 'a_order_all', 'a_order_one'])]
    #[ORM\OneToOne(mappedBy: 'eventSeat', cascade: ['persist', 'remove'])]
    private ?SubscriptionUsage $subscriptionUsage = null;

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

    public function getEventPrice(): ?EventPrice
    {
        return $this->eventPrice;
    }

    public function setEventPrice(?EventPrice $eventPrice): self
    {
        $this->eventPrice = $eventPrice;

        return $this;
    }

    public function getEventRow(): ?EventRow
    {
        return $this->eventRow;
    }

    public function setEventRow(?EventRow $eventRow): self
    {
        $this->eventRow = $eventRow;

        return $this;
    }

    public function getSubscriptionUsage(): ?SubscriptionUsage
    {
        return $this->subscriptionUsage;
    }

    public function setSubscriptionUsage(SubscriptionUsage $subscriptionUsage): static
    {
        // set the owning side of the relation if necessary
        if ($subscriptionUsage->getEventRow() !== $this) {
            $subscriptionUsage->setEventRow($this);
        }

        $this->subscriptionUsage = $subscriptionUsage;

        return $this;
    }
}
