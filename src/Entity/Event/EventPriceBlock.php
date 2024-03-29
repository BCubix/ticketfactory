<?php

namespace App\Entity\Event;

use App\Entity\Language\Language;
use App\Repository\EventPriceBlockRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: EventPriceBlockRepository::class)]
class EventPriceBlock
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du bloc doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du bloc doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\Valid]
    #[Assert\Count(min: 1, minMessage: 'Vous devez renseigner au moins un tarif.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\OneToMany(mappedBy: 'eventPriceBlock', targetEntity: EventPrice::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $eventPrices;

    #[ORM\ManyToOne(targetEntity: Event::class, inversedBy: 'eventPriceBlocks')]
    #[ORM\JoinColumn(nullable: false)]
    private $event;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;


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
