<?php

namespace App\Entity\Content;

use App\Entity\Datable;
use App\Entity\JsonDoctrineSerializable;
use App\Repository\ContentRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[ORM\Entity(repositoryClass: ContentRepository::class)]
class Content extends Datable implements JsonDoctrineSerializable
{
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column]
    private array $fields = [];

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(targetEntity: ContentType::class, inversedBy: 'contents')]
    #[ORM\JoinColumn(nullable: false)]
    private $contentType;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

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

    public function getContentType(): ?ContentType
    {
        return $this->contentType;
    }

    public function setContentType(?ContentType $contentType): self
    {
        $this->contentType = $contentType;

        return $this;
    }

    public function jsonSerialize(): mixed
    {

        return $this->fields;
    }

    public static function jsonDeserialize($data): self
    {
        return $data;
    }
}
