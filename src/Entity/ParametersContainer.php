<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;

class ParametersContainer
{
    private $parameters;

    public function __construct()
    {
        $this->parameters = new ArrayCollection();
    }

    public function getParameters(): ArrayCollection
    {
        return $this->parameters;
    }

    public function addParameter(Parameter $parameter): self
    {
        if (!$this->parameters->contains($parameter))
            $this->parameters[] = $parameter;

        return $this;
    }

    public function removeParameter(Parameter $parameter): self
    {
        $this->parameters->removeElement($parameter);
        return $this;
    }
}