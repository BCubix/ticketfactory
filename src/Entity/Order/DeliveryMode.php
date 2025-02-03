<?php

namespace App\Entity\Order;

use App\Entity\Addon\Module;
use App\Entity\Datable;
use App\Repository\DeliveryModeRepository;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: DeliveryModeRepository::class)]
class DeliveryMode extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_delivery_mode_all', 'a_delivery_mode_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_delivery_mode_all', 'a_delivery_mode_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_delivery_mode_all', 'a_delivery_mode_one'])]
    #[ORM\ManyToOne(inversedBy: 'deliveryModes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Module $module = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_delivery_mode_all', 'a_delivery_mode_one'])]
    #[ORM\Column(length: 255)]
    private ?string $manager = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_delivery_mode_all', 'a_delivery_mode_one'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

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

    public function getManager(): ?string
    {
        return $this->manager;
    }

    public function setManager(string $manager): static
    {
        $this->manager = $manager;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }
}
