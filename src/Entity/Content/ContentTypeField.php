<?php

namespace App\Entity\Content;

use App\Entity\JsonDoctrineSerializable;

class ContentTypeField implements JsonDoctrineSerializable
{
    private ?string $title = null;

    private ?string $name = null;

    private ?string $helper = null;

    private ?string $type = null;

    private ?array $options = [];

    private ?array $validations = [];

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

        return [
            'title'       => $this->title,
            'name'        => $this->name,
            'helper'      => $this->helper,
            'type'        => $this->type,
            'options'     => $options,
            'validations' => $validations
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

        return $object;
    }
}
