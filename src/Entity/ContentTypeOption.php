<?php

namespace App\Entity;

class ContentTypeOption implements JsonDoctrineSerializable
{
    private ?string $name = null;

    private ?string $value = null;

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function jsonSerialize(): string
    {
        return json_encode([$this->name => $this->value]);
    }

    public static function jsonUnserialize($data): self
    {
        $data = json_decode($data, true);

        $object = new self();
        $object->name  = $data['name'];
        $object->value = $data['value'];
    }
}
