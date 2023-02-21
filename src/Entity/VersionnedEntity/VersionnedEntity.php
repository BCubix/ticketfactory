<?php

namespace App\Entity\VersionnedEntity;

use App\Repository\VersionnedEntityRepository;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: VersionnedEntityRepository::class)]
class VersionnedEntity
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_version_all', 'a_version_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_version_all', 'a_version_one'])]
    #[ORM\Column(length: 255)]
    private ?string $entityKeyword = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_version_all', 'a_version_one'])]
    #[ORM\Column]
    private ?int $entityId = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_version_all', 'a_version_one'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $revisionDate = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_version_all', 'a_version_one'])]
    #[ORM\Column]
    private array $fields = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEntityKeyword(): ?string
    {
        return $this->entityKeyword;
    }

    public function setEntityKeyword(string $entityKeyword): self
    {
        $this->entityKeyword = $entityKeyword;

        return $this;
    }

    public function getEntityId(): ?int
    {
        return $this->entityId;
    }

    public function setEntityId(int $entityId): self
    {
        $this->entityId = $entityId;

        return $this;
    }

    public function getRevisionDate(): ?\DateTimeInterface
    {
        return $this->revisionDate;
    }

    public function setRevisionDate(\DateTimeInterface $revisionDate): self
    {
        $this->revisionDate = $revisionDate;

        return $this;
    }

    public function getFields(): array
    {
        return $this->fields;
    }

    public function setFields(array $fields): self
    {
        $this->fields = $fields;

        return $this;
    }
}
