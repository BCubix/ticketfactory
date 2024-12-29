<?php

namespace App\Entity\Event;

use App\Entity\Language\Language;
use App\Repository\EventPriceRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: EventPriceRepository::class)]
class EventPrice
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one', 'a_order_all', 'a_order_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du tarif doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du tarif doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one', 'a_order_all', 'a_order_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one', 'a_order_all', 'a_order_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one', 'a_order_all', 'a_order_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $annotation;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one', 'a_order_all', 'a_order_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'boolean')]
    private $defaultPrice;

    #[Assert\PositiveOrZero(message: 'Le tarif doit être un nombre supérieur ou égal à 0.')]
    #[Assert\NotBlank(message: 'Le tarif doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one', 'a_order_all', 'a_order_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'float')]
    private $price;

    #[ORM\ManyToOne(targetEntity: EventPriceCategory::class, inversedBy: 'eventPrices')]
    #[ORM\JoinColumn(nullable: false)]
    private $eventPriceCategory;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one', 'a_order_all', 'a_order_one', 'a_room_one', 'a_room_all'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_cart_one', 'a_order_all', 'a_order_one', 'a_room_one', 'a_room_all'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private $ticketingReference = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
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

    public function getAnnotation(): ?string
    {
        return $this->annotation;
    }

    public function setAnnotation(?string $annotation): self
    {
        $this->annotation = $annotation;

        return $this;
    }

    public function getDefaultPrice(): ?bool
    {
        return $this->defaultPrice;
    }

    public function setDefaultPrice(bool $defaultPrice): self
    {
        $this->defaultPrice = $defaultPrice;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getEventPriceCategory(): ?EventPriceCategory
    {
        return $this->eventPriceCategory;
    }

    public function setEventPriceCategory(?EventPriceCategory $eventPriceCategory): self
    {
        $this->eventPriceCategory = $eventPriceCategory;

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

    public function getTicketingReference(): ?int
    {
        return $this->ticketingReference;
    }

    public function setTicketingReference(?int $ticketingReference): self
    {
        $this->ticketingReference = $ticketingReference;

        return $this;
    }
}
