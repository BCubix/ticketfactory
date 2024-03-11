<?php

namespace App\Entity\Ticketing;

use App\Entity\Datable;
use App\Entity\Addon\Module;
use App\Repository\TicketingRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[ORM\Entity(repositoryClass: TicketingRepository::class)]
class Ticketing extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_ticketing_all', 'a_ticketing_one'])]
    #[ORM\ManyToOne]
    private ?Module $module = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_ticketing_one'])]
    #[ORM\Column]
    private array $data = [];

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

    public function getModule(): ?Module
    {
        return $this->module;
    }

    public function setModule(?Module $module): static
    {
        $this->module = $module;

        return $this;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }
}
