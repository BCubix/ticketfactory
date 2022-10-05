<?php

namespace App\Entity\Event;

use App\Repository\EventDateRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: EventDateRepository::class)]
class EventDate
{
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
    #[ORM\Column(type: 'datetime')]
    private $eventDate;

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


    public function getId(): ?int
    {
        return $this->id;
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
}
