<?php

namespace App\Entity\Subscription;

use App\Entity\Event\Event;
use App\Entity\Order\EventSeat;
use App\Entity\Order\Order;
use App\Entity\Order\SubscriptionRow;
use App\Repository\SubscriptionUsageRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: SubscriptionUsageRepository::class)]
class SubscriptionUsage
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_order_one', 'a_cart_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_one', 'a_cart_one'])]
    #[ORM\ManyToOne(inversedBy: 'subscriptionUsages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?SubscriptionRow $subscriptionRow = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_one', 'a_cart_one'])]
    #[ORM\OneToOne(inversedBy: 'subscriptionUsage', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?EventSeat $eventSeat = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_one', 'a_cart_one'])]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Event $event = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_order_one', 'a_cart_one'])]
    #[ORM\ManyToOne(inversedBy: 'subscriptionUsages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Order $linkedOrder = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSubscriptionRow(): ?SubscriptionRow
    {
        return $this->subscriptionRow;
    }

    public function setSubscriptionRow(?SubscriptionRow $subscriptionRow): static
    {
        $this->subscriptionRow = $subscriptionRow;

        return $this;
    }

    public function getEventSeat(): ?EventSeat
    {
        return $this->eventSeat;
    }

    public function setEventSeat(EventSeat $eventSeat): static
    {
        $this->eventSeat = $eventSeat;

        return $this;
    }

    public function getEvent(): ?Event
    {
        return $this->event;
    }

    public function setEvent(?Event $event): static
    {
        $this->event = $event;

        return $this;
    }

    public function getLinkedOrder(): ?Order
    {
        return $this->linkedOrder;
    }

    public function setLinkedOrder(?Order $linkedOrder): static
    {
        $this->linkedOrder = $linkedOrder;

        return $this;
    }
}
