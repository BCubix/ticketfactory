<?php

namespace App\Entity\Event;

use App\Entity\Datable;
use App\Repository\EventTypeRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: EventTypeRepository::class)]
class EventType extends Datable
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_event_all', 'a_event_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_event_all', 'a_event_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }
}
