<?php

namespace App\Entity\Technical;

use App\Entity\Datable;
use App\Repository\RedirectionRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: RedirectionRepository::class)]
class Redirection extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    const REDIRECT_PERMANENT = 301;
    const REDIRECT_TEMPORARY = 302;

    #[JMS\Expose()]
    #[JMS\Groups(['a_redirection_all', 'a_redirection_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[Assert\Choice(choices: [Redirection::REDIRECT_PERMANENT, Redirection::REDIRECT_TEMPORARY], message: 'Vous devez choisir un type valide.')]
    #[Assert\NotBlank(message: 'Le type de la redirection doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_redirection_all', 'a_redirection_one'])]
    #[ORM\Column(type: 'integer')]
    private ?int $redirectType = null;

    #[Assert\Length(max: 1000, maxMessage: 'L\'URL à rediriger doit être inférieure à 1000 caractères.')]
    #[Assert\NotBlank(message: 'L\'URL à rediriger doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_redirection_all', 'a_redirection_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $redirectFrom = null;

    #[Assert\Length(max: 1000, maxMessage: 'L\'URL vers laquelle rediriger doit être inférieure à 1000 caractères.')]
    #[Assert\NotBlank(message: 'L\'URL vers laquele rediriger doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_redirection_all', 'a_redirection_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $redirectTo = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRedirectType(): ?int
    {
        return $this->redirectType;
    }

    public function setRedirectType(int $redirectType): self
    {
        $this->redirectType = $redirectType;

        return $this;
    }

    public function getRedirectFrom(): ?string
    {
        return $this->redirectFrom;
    }

    public function setRedirectFrom(string $redirectFrom): self
    {
        $this->redirectFrom = $redirectFrom;

        return $this;
    }

    public function getRedirectTo(): ?string
    {
        return $this->redirectTo;
    }

    public function setRedirectTo(string $redirectTo): self
    {
        $this->redirectTo = $redirectTo;

        return $this;
    }
}
