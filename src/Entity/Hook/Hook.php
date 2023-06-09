<?php

namespace App\Entity\Hook;

use App\Entity\Addon\Module;
use App\Repository\HookRepository;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: HookRepository::class)]
class Hook
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_hook_all', 'a_hook_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['a_hook_all', 'a_hook_one'])]
    #[ORM\Column(type: Types::STRING, length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['a_hook_all', 'a_hook_one'])]
    #[ORM\ManyToOne(inversedBy: 'hooks', targetEntity: Module::class)]
    private $module;

    #[JMS\Expose()]
    #[JMS\Groups(['a_hook_all', 'a_hook_one'])]
    #[ORM\Column(type: Types::STRING, length: 255)]
    private $classname;

    #[JMS\Expose()]
    #[JMS\Groups(['a_hook_all', 'a_hook_one'])]
    #[ORM\Column(type: Types::INTEGER)]
    private $position;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getModule(): ?Module
    {
        return $this->module;
    }

    public function setModule(?Module $module): self
    {
        $this->module = $module;

        return $this;
    }

    public function getClassName(): string
    {
        return $this->classname;
    }

    public function setClassName(string $classname): self
    {
        $this->classname = $classname;

        return $this;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition($position): self
    {
        $this->position = $position;

        return $this;
    }
}