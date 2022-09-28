<?php

namespace App\Entity\Content;

use App\Entity\Datable;
use App\Entity\JsonDoctrineSerializable;
use App\Repository\ContentTypeRepository;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ContentTypeRepository::class)]
class ContentType extends Datable implements JsonDoctrineSerializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'json')]
    private array $fields = [];


    public function __construct()
    {
        $this->active  = true;
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

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

    public function jsonSerialize(): string
    {
        $fields = [];
        foreach ($this->fields as $field) {
            $fields[] = $field->jsonSerialize();
        }

        $this->fields = $fields;

        return $this->fields;
    }

    public static function jsonDeserialize($data): self
    {
        $fields = [];
        foreach ($data->fields as $field) {
            $fields[] = ContentTypeField::jsonDeserialize($field);
        }

        $data->fields = $fields;

        return $data;
    }
}
