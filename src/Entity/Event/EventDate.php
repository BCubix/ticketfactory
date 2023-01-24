<?php

namespace App\Entity\Event;

use App\Entity\Language\Language;
use App\Repository\EventDateRepository;
use App\Validation\Constraint\EventDateConstraint;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[EventDateConstraint]
#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: EventDateRepository::class)]
class EventDate
{
    /*** > Trait ***/
    /*** < Trait ***/

    const STATES = [
        'valid'    => 'Valide',
        'delayed'  => 'Reporté',
        'canceled' => 'Annulé',
        'new_date' => 'Nouvelle date'
    ];

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\GreaterThan(value: "1970-01-01", message: 'Vous devez renseigner une date valide.')]
    #[Assert\NotBlank(message: 'La date doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'datetime')]
    private $eventDate;

    #[Assert\Choice(callback: 'getStateKeys', message: 'Vous devez renseigner un statut valide.')]
    #[Assert\NotBlank(message: 'Le statut doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 15, nullable: true)]
    private $state;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'datetime', nullable: true)]
    private $reportDate;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $annotation;

    #[ORM\ManyToOne(targetEntity: EventDateBlock::class, inversedBy: 'eventDates')]
    #[ORM\JoinColumn(nullable: false)]
    private $eventDateBlock;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(inversedBy: 'eventDates')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;


    public function getId(): ?int
    {
        return $this->id;
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

    public function getEventDate(): ?\DateTimeInterface
    {
        return $this->eventDate;
    }

    public function setEventDate(\DateTimeInterface $eventDate): self
    {
        $this->eventDate = $eventDate;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getReportDate(): ?\DateTimeInterface
    {
        return $this->reportDate;
    }

    public function setReportDate(?\DateTimeInterface $reportDate): self
    {
        $this->reportDate = $reportDate;

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

    public function getEventDateBlock(): ?EventDateBlock
    {
        return $this->eventDateBlock;
    }

    public function setEventDateBlock(?EventDateBlock $eventDateBlock): self
    {
        $this->eventDateBlock = $eventDateBlock;

        return $this;
    }

    public function getStateKeys() {
        return array_keys(self::STATES);
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
