<?php

namespace App\Entity\User;

use App\Entity\Datable;
use App\Repository\UserRepository;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\UniqueEntity(fields: 'email', message: 'Un utilisateur existe déjà avec cette adresse.')]
#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User extends Datable implements UserInterface, PasswordAuthenticatedUserInterface
{
    /*** > Trait ***/
    /*** < Trait ***/

    const ROLE_TYPE = [
        "ROLE_USER" => 'Utilisateur',
        "ROLE_ADMIN" => "Admin"
    ];

    #[JMS\Expose()]
    #[JMS\Groups(['a_log_all', 'a_log_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'L\'email doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'L\'email doit être renseigné.')]
    #[Assert\Email(message: 'Vous devez renseigner une adresse email valide.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_log_all', 'a_log_one', 'a_user_all', 'a_user_one'])]
    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private $email;

    #[Assert\Length(max: 250, maxMessage: 'Le prénom doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le prénom doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_user_all', 'a_user_one'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $firstName;

    #[Assert\Length(max: 250, maxMessage: 'Le nom doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_user_all', 'a_user_one'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $lastName;

    #[JMS\Expose()]
    #[JMS\Groups(['a_user_all', 'a_user_one'])]
    #[ORM\Column(type: 'json')]
    private $roles = [];

    #[ORM\Column(type: 'string')]
    private $password;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $emailToken = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $passwordRequestedAt = null;

    #[Assert\Regex(pattern: '/^\S*(?=\S{10,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*$/', message: 'Le mot de passe ne répond pas aux exigences de sécurité.')]
    private $plainPassword;


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
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
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
}
