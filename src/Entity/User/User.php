<?php

namespace App\Entity\User;

use App\Entity\Datable;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[UniqueEntity(fields: 'email', message: 'Un utilisateur existe déjà avec cette adresse.')]
#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User extends Datable implements UserInterface, PasswordAuthenticatedUserInterface
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_log_all', 'a_log_one', 'a_user_all', 'a_user_one', 'a_profile_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'L\'email doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'L\'email doit être renseigné.')]
    #[Assert\Email(message: 'Vous devez renseigner une adresse email valide.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_log_all', 'a_log_one', 'a_user_all', 'a_user_one', 'a_profile_one'])]
    #[ORM\Column(type: 'string', length: 123, unique: true)]
    private $email;

    #[Assert\Length(max: 250, maxMessage: 'Le prénom doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le prénom doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_user_all', 'a_user_one', 'a_profile_one'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $firstName;

    #[Assert\Length(max: 250, maxMessage: 'Le nom doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_user_all', 'a_user_one', 'a_profile_one'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $lastName;

    #[ORM\Column(type: 'string')]
    private $password;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $emailToken = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $passwordRequestedAt = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_user_all', 'a_user_one'])]
    #[ORM\ManyToMany(targetEntity: Profile::class, mappedBy: 'users')]
    private Collection $profiles;

    #[Assert\Regex(pattern: '/^\S*(?=\S{10,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*$/', message: 'Le mot de passe ne répond pas aux exigences de sécurité.')]
    private $plainPassword;

    public function __construct()
    {
        $this->profiles = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = strtolower($email);

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getEmailToken(): ?string
    {
        return $this->emailToken;
    }

    public function setEmailToken(?string $emailToken): self
    {
        $this->emailToken = $emailToken;

        return $this;
    }

    public function getPasswordRequestedAt(): ?\DateTimeInterface
    {
        return $this->passwordRequestedAt;
    }

    public function setPasswordRequestedAt(?\DateTimeInterface $passwordRequestedAt): self
    {
        $this->passwordRequestedAt = $passwordRequestedAt;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return $this->getUsername();
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Profile>
     */
    public function getProfiles(): Collection
    {
        return $this->profiles;
    }

    public function addProfile(Profile $profile): static
    {
        if (!$this->profiles->contains($profile)) {
            $this->profiles->add($profile);
            $profile->addUser($this);
        }

        return $this;
    }

    public function removeProfile(Profile $profile): static
    {
        if ($this->profiles->removeElement($profile)) {
            $profile->removeUser($this);
        }

        return $this;
    }

    public function getRoles(): array
    {
        $roles = [];
        foreach ($this->profiles as $profile) {
            foreach ($profile->getRoles() as $role) {
                $roles[] = $role;
            }
        }

        return array_unique($roles);
    }
}
