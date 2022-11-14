<?php

namespace App\Entity\Content;

use App\Entity\JsonDoctrineSerializable;

use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

class ContentTypeField implements JsonDoctrineSerializable
{
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
        $options = [];
        foreach ($this->options as $option) {
            $options[] = $option->jsonSerialize();
        }

        $validations = [];
        foreach ($this->validations as $validation) {
            $validations[] = $validation->jsonSerialize();
        }

        $parameters = [];
        foreach ($this->parameters as $parameter) {
            $parameters[] = $parameter->jsonSerialize();
        }

        return [
            'title'       => $this->title,
            'name'        => $this->name,
            'helper'      => $this->helper,
            'type'        => $this->type,
            'options'     => $options,
            'validations' => $validations,
            'parameters'  => $parameters,
        ];
    }

    public static function jsonDeserialize($data): self
    {
        $object = new self();
        $object->title  = $data['title'];
        $object->name   = $data['name'];
        $object->helper = $data['helper'];
        $object->type   = $data['type'];

        $object->options = [];
        foreach ($data['options'] as $option) {
            $object->options[] = ContentTypeOption::jsonDeserialize($option);
        }

        $object->validations = [];
        foreach ($data['validations'] as $validation) {
            $object->validations[] = ContentTypeValidation::jsonDeserialize($validation);
        }

        if (array_key_exists("parameters", $data)) {
            $object->parameters = [];
            foreach ($data['parameters'] as $parameter) {
                $object->parameters[] = ContentTypeParameter::jsonDeserialize($parameter);
            }
        }

        return $object;
    }
}
