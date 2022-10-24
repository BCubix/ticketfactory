<?php

namespace App\Entity\Content;

use App\Entity\JsonDoctrineSerializable;
use JMS\Serializer\Annotation as JMS;

class ContentTypeParameter implements JsonDoctrineSerializable
{
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
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

    public function jsonSerialize(): mixed
    {
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
