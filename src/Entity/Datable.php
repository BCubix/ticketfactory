<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\MappedSuperclass]
#[ORM\HasLifecycleCallbacks()]
class Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: 'datetime_immutable')]
    private $createdAt;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: 'datetime_immutable')]
    private $updatedAt;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: 'boolean')]
    private $active = false;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function refreshUpdated() {
        if (is_null($this->getCreatedAt())) {
            $this->setCreatedAt(new \DateTimeImmutable("now"));
        }

        $this->setUpdatedAt(new \DateTimeImmutable("now"));
    }
}
