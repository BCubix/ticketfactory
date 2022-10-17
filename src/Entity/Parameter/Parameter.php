<?php

namespace App\Entity\Parameter;

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
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $type;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $paramKey;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $paramValue;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'json', nullable: true)]
    private $availableValue = [];

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $tabName;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $blockName;


    public function getId(): int
    {
        return $this->id;
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

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getParamKey(): string
    {
        return $this->paramKey;
    }

    public function setParamKey(string $paramKey): self
    {
        $this->paramKey = $paramKey;

        return $this;
    }

    public function getParamValue(): string
    {
        return $this->paramValue;
    }

    public function setParamValue(?string $paramValue): self
    {
        $this->paramValue = $paramValue;

        return $this;
    }

    public function getAvailableValue(): array
    {
        return $this->availableValue;
    }

    public function setAvailableValue(?array $availableValue): self
    {
        $this->availableValue = $availableValue;

        return $this;
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

    public function getBlockName(): string
    {
        return $this->blockName;
    }

    public function setBlockName(string $blockName): self
    {
        $this->blockName = $blockName;

        return $this;
    }
}
