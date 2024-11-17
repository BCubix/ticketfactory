<?php

namespace App\Entity\User;

use App\Entity\Datable;
use App\Repository\ProfileRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use JMS\Serializer\Annotation as JMS;
use Doctrine\ORM\Mapping as ORM;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: ProfileRepository::class)]
class Profile extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, User>
     */
    #[JMS\Expose()]
    #[JMS\Groups(['a_profile_all', 'a_profile_one'])]
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'profiles')]
    private Collection $users;

    /**
     * @var Collection<int, Role>
     */
    #[JMS\Expose()]
    #[JMS\Groups(['a_profile_all', 'a_profile_one', 'a_user_all', 'a_user_one'])]
    #[ORM\ManyToMany(targetEntity: Role::class)]
    private Collection $roles;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->roles = new ArrayCollection();
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

    /**
     * @return Collection<int, Role>
     */
    public function getRoles(): Collection
    {
        return $this->roles;
    }

    public function addRole(Role $role): static
    {
        if (!$this->roles->contains($role)) {
            $this->roles->add($role);
        }

        return $this;
    }

    public function removeRole(Role $role): static
    {
        $this->roles->removeElement($role);

        return $this;
    }

    public function getRoleNames(): array
    {
        $roles = [];

        foreach($this->roles as $role) {
            $roles[] = $role->getName();
        }

        return $roles;
    }
}
