<?php

namespace App\Entity\ContactRequest;

use App\Entity\Datable;
use App\Repository\ContactRequestRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: ContactRequestRepository::class)]
class ContactRequest extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le prénom doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le prénom doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $firstName = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $lastName = null;

    #[Assert\Length(max: 250, maxMessage: 'L\'email doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'L\'email doit être renseigné.')]
    #[Assert\Email(message: 'Vous devez renseigner une adresse email valide.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $email = null;

    #[Assert\Length(max: 250, maxMessage: 'Le téléphone doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le téléphone doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $phone = null;

    #[Assert\Length(max: 1000, maxMessage: 'L\'objet doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'L\'objet doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $subject = null;

    #[Assert\NotBlank(message: 'Le message doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'text')]
    private ?string $message = null;


    public function getId(): ?int
    {
        return $this->id;
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): self
    {
        $this->subject = $subject;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }
}
