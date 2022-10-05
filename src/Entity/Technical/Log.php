<?php

namespace App\Entity\Technical;

use App\Entity\Datable;
use App\Repository\LogRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: LogRepository::class)]
class Log extends Datable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'smallint')]
    private $severity;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private $errorCode;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 511)]
    private $message;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 63, nullable: true)]
    private $objectName;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private $objectId;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: User::class)]
    private $user;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSeverity(): ?int
    {
        return $this->severity;
    }

    public function setSeverity(int $severity): self
    {
        $this->severity = $severity;

        return $this;
    }

    public function getErrorCode(): ?int
    {
        return $this->errorCode;
    }

    public function setErrorCode(?int $errorCode): self
    {
        $this->errorCode = $errorCode;

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

    public function getObjectName(): ?string
    {
        return $this->objectName;
    }

    public function setObjectName(?string $objectName): self
    {
        $this->objectName = $objectName;

        return $this;
    }

    public function getObjectId(): ?int
    {
        return $this->objectId;
    }

    public function setObjectId(?int $objectId): self
    {
        $this->objectId = $objectId;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
