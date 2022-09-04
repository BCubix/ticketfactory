<?php

namespace App\Entity;

use App\Repository\RedirectionRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: RedirectionRepository::class)]
class Redirection extends Datable
{
    const REDIRECT_PERMANENT = 301;
    const REDIRECT_TEMPORARY = 302;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column]
    private ?int $redirectType = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 255)]
    private ?string $redirectFrom = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 255)]
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
