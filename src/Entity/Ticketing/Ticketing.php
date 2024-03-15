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

    public const TYPE_MAPPING = [
        'api' => "Api",
        'iframe' => "Iframe",
        'external' => "Lien externe",
    ];

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
    #[JMS\Groups(['a_ticketing_one'])]
    #[ORM\Column]
    private ?array $data = [];

    #[JMS\Expose()]
    #[JMS\Groups(['a_ticketing_all', 'a_ticketing_one'])]
    #[ORM\Column(length: 16)]
    private ?string $type = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_ticketing_all', 'a_ticketing_one'])]
    #[ORM\Column]
    private ?bool $catalogSynchronization = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_ticketing_all', 'a_ticketing_one'])]
    #[ORM\Column]
    private ?bool $customerProfile = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_ticketing_all', 'a_ticketing_one'])]
    #[ORM\Column]
    private ?bool $orderTunnel = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_ticketing_all', 'a_ticketing_one'])]
    #[ORM\Column]
    private ?bool $defaultTicketing = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_ticketing_all', 'a_ticketing_one'])]
    #[ORM\ManyToOne]
    private ?Module $module = null;

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

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function isCatalogSynchronization(): ?bool
    {
        return $this->catalogSynchronization;
    }

    public function setCatalogSynchronization(bool $catalogSynchronization): static
    {
        $this->catalogSynchronization = $catalogSynchronization;

        return $this;
    }

    public function isCustomerProfile(): ?bool
    {
        return $this->customerProfile;
    }

    public function setCustomerProfile(bool $customerProfile): static
    {
        $this->customerProfile = $customerProfile;

        return $this;
    }

    public function isOrderTunnel(): ?bool
    {
        return $this->orderTunnel;
    }

    public function setOrderTunnel(bool $orderTunnel): static
    {
        $this->orderTunnel = $orderTunnel;

        return $this;
    }

    public function isDefaultTicketing(): ?bool
    {
        return $this->defaultTicketing;
    }

    public function setDefaultTicketing(bool $defaultTicketing): static
    {
        $this->defaultTicketing = $defaultTicketing;

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
}
