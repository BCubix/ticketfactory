<?php

namespace App\Entity\Content;

use App\Entity\JsonDoctrineSerializable;

use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

class ContentTypeField implements JsonDoctrineSerializable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[Assert\Length(max: 250, maxMessage: 'Le titre du champ doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le titre du champ doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?string $title = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du champ doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du champ doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?string $helper = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?string $type = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?array $options = [];

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?array $validations = [];

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?array $parameters = [];

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
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

    public function getHelper(): ?string
    {
        return $this->helper;
    }

    public function setHelper(?string $helper): self
    {
        $this->helper = $helper;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getOptions(): array
    {
        return $this->options;
    }

    public function setOptions(array $options): self
    {
        $this->options = $options;

        return $this;
    }

    public function getValidations(): array
    {
        return $this->validations;
    }

    public function setValidations(array $validations): self
    {
        $this->validations = $validations;

        return $this;
    }

    public function getParameters(): array
    {
        return $this->parameters;
    }

    public function setParameters(array $parameters): self
    {
        $this->parameters = $parameters;

        return $this;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'title'       => $this->title,
            'name'        => $this->name,
            'helper'      => $this->helper,
            'type'        => $this->type,
            'options'     => $this->jsonNodeSerialize($this->options),
            'validations' => $this->jsonNodeSerialize($this->validations),
            'parameters'  => $this->jsonNodeSerialize($this->parameters)
        ];
    }

    public static function jsonDeserialize($data): self
    {
        $object              = new self();
        $object->title       = $data['title'];
        $object->name        = $data['name'];
        $object->helper      = $data['helper'];
        $object->type        = $data['type'];
        $object->options     = self::jsonNodeDeserialize($data['options']);
        $object->validations = self::jsonNodeDeserialize($data['validations']);
        $object->parameters  = self::jsonNodeDeserialize($data['parameters']);

        return $object;
    }

    private function jsonNodeSerialize($data): mixed
    {
        switch (gettype($data)) {
            case "array":
                $arr = [];
                foreach ($data as $key => $value) {
                    $arr[$key] = $this->jsonNodeSerialize($value);
                }
                return $arr;

            case "object":
                return [
                    'type' => 'object',
                    'typeName' => get_class($data),
                    'data' => $data->jsonSerialize()
                ];

            default:
                return [
                    'type' => 'type',
                    'typeName' => gettype($data),
                    'data' => $data
                ];
        }
    }

    private static function jsonNodeDeserialize($data): mixed
    {
        // Every field is encoded as an array containing its type and its value
        if (!is_array($data)) {
            throw new \Exception('Serialization error.');
        }

        // Array
        if (!isset($data['type']) || !isset($data['typeName'])) {
            $arr = [];
            foreach ($data as $key => $value) {
                $arr[$key] = self::jsonNodeDeserialize($value);
            }
            return $arr;
        }

        // Object
        if ($data['type'] =='object') {
            $className = $data['typeName'];
            return $className::jsonDeserialize($data['data']);
        }

        // Primitive
        if ($data['type'] =='type') {
            return $data['data'];
        }
    }
}
