<?php

namespace App\Entity;

use App\Repository\ParameterRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: ParameterRepository::class)]
class Parameter
{
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $tabName;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $key;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $type;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $value;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'json')]
    private $availableValue = [];


    public function getId(): int
    {
        return $this->id;
    }

    public function getTabName(): string
    {
        return $this->tabName;
    }

    public function setTabName(string $tabName): self
    {
        $this->tabName = $tabName;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function setKey(string $key): self
    {
        $this->key = $key;
        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;
        return $this;
    }

    public function getAvailableValue(): array
    {
        return $this->availableValue;
    }

    public function setAvailableValue(array $availableValue): self
    {
        $this->availableValue = $availableValue;
        return $this;
    }
}