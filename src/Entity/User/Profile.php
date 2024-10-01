<?php

namespace App\Entity\User;

use App\Repository\ProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use JMS\Serializer\Annotation as JMS;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProfileRepository::class)]
class Profile
{
    /*** > Trait ***/
    /*** < Trait ***/

    const ROLE_TYPE = [
        "ROLE_VIEWER" => 'Lecteur',
        "ROLE_AUTHOR" => "Auteur",
        "ROLE_EDITOR" => "Editeur",
        "ROLE_REMOVER" => "Suppression",
        "ROLE_ADMIN" => "Admin"
    ];

    #[JMS\Expose()]
    #[JMS\Groups(['a_profile_all', 'a_profile_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_profile_all', 'a_profile_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_profile_one'])]
    #[ORM\Column]
    private array $roles = [];

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'profiles')]
    private Collection $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

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

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        $this->users->removeElement($user);

        return $this;
    }
}
