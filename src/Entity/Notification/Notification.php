<?php

namespace App\Entity\Notification;

use App\Entity\User\User;
use App\Repository\NotificationRepository;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks()]
#[ORM\Entity(repositoryClass: NotificationRepository::class)]
class Notification
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_notification_all', 'a_notification_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: 'datetime_immutable')]
    private $createdAt;

    #[JMS\Expose()]
    #[JMS\Groups(['a_notification_all', 'a_notification_one'])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_notification_all', 'a_notification_one'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_notification_all', 'a_notification_one'])]
    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_notification_all', 'a_notification_one'])]
    #[ORM\Column(nullable: true)]
    private ?int $objectId = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_notification_all', 'a_notification_one'])]
    #[ORM\Column]
    private ?bool $readed = false;

    #[JMS\Expose()]
    #[JMS\Groups(['a_notification_all', 'a_notification_one'])]
    #[ORM\ManyToOne(inversedBy: 'notifications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getObjectId(): ?int
    {
        return $this->objectId;
    }

    public function setObjectId(?int $objectId): static
    {
        $this->objectId = $objectId;

        return $this;
    }

    public function isReaded(): ?bool
    {
        return $this->readed;
    }

    public function setReaded(bool $readed): static
    {
        $this->readed = $readed;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function refreshUpdated() {
        if (is_null($this->getCreatedAt())) {
            $this->setCreatedAt(new \DateTimeImmutable("now"));
        }
    }
}
