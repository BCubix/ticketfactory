<?php

namespace App\Entity\Customer;

use App\Entity\Order\Cart;
use App\Entity\Datable;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\UniqueEntity(fields: 'email', message: 'Un utilisateur existe déjà avec cette adresse.')]
#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: CustomerRepository::class)]
class Customer extends Datable implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const CIVILITIES = [
        'M.'   => 'Monsieur',
        'Mme.' => 'Madame'
    ];

    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_customer_all', 'a_customer_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'L\'email doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'L\'email doit être renseigné.')]
    #[Assert\Email(message: 'Vous devez renseigner une adresse email valide.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_customer_all', 'a_customer_one'])]
    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $password = null;

    #[Assert\Length(max: 250, maxMessage: 'Le prénom doit être inférieur à {{ limit }} caractères.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_customer_all', 'a_customer_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $firstName = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom doit être inférieur à {{ limit }} caractères.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_customer_all', 'a_customer_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lastName = null;

    #[Assert\Choice(callback: 'getCivilitiesKeys', message: 'Vous devez choisir une civilité valide.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_cart_all', 'a_cart_one', 'a_customer_all', 'a_customer_one'])]
    #[ORM\Column(length: 3, nullable: true)]
    private ?string $civility = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $emailToken = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $passwordRequestedAt = null;

    #[Assert\Regex(pattern: '/^\S*(?=\S{10,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*$/', message: 'Le mot de passe ne répond pas aux exigences de sécurité.')]
    private $plainPassword;

    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Cart::class)]
    private Collection $carts;
    

    public function __construct()
    {
        $this->carts = new ArrayCollection();
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
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getCivility(): ?string
    {
        return $this->civility;
    }

    public function setCivility(?string $civility): self
    {
        $this->civility = $civility;

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
     * @see UserInterface
     */
    public function getRoles(): array
    {
        return ['ROLE_CUSTOMER'];
    }

    public function setRoles(array $roles): self
    {
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
     * @return Collection<int, Cart>
     */
    public function getCarts(): Collection
    {
        return $this->carts;
    }

    public function addCart(Cart $cart): self
    {
        if (!$this->carts->contains($cart)) {
            $this->carts->add($cart);
            $cart->setCustomer($this);
        }

        return $this;
    }

    public function removeCart(Cart $cart): self
    {
        if ($this->carts->removeElement($cart)) {
            // set the owning side to null (unless already changed)
            if ($cart->getCustomer() === $this) {
                $cart->setCustomer(null);
            }
        }

        return $this;
    }

    public function getCivilitiesKeys() {
        return array_keys(self::CIVILITIES);
    }
}
