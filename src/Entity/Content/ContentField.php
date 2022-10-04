<?php

namespace App\Entity\Content;

use App\Entity\JsonDoctrineSerializable;

class ContentField implements JsonDoctrineSerializable
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

    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function jsonSerialize(): string
    {
        return json_encode([
            'name'  => $this->name,
            'value' => $this->value
        ]);

        return [$this->name => $this->value];
    }

    public static function jsonDeserialize($data): self
    {
        $object = new self();
        $object->name  = array_key_first($data);
        $object->value = $data[$object->name];

        return $object;
    }
}
