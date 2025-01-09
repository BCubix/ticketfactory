<?php

namespace App\Entity\User;

use App\Entity\Addon\Module;
use App\Repository\RoleRepository;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: RoleRepository::class)]
class Role
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_role_all', 'a_role_one', 'a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_role_all', 'a_role_one', 'a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_role_all', 'a_role_one', 'a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_role_all', 'a_role_one', 'a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_role_all', 'a_role_one', 'a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Column(length: 255)]
    private ?string $groupName = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_role_all', 'a_role_one', 'a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
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

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

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

    public function getGroupName(): ?string
    {
        return $this->groupName;
    }

    public function setGroupName(string $groupName): static
    {
        $this->groupName = $groupName;

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
