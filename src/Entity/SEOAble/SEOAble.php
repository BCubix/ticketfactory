<?php

namespace App\Entity\SEOAble;

use App\Entity\Media\Media;

use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

trait SEOAble
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private $metaTitle;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: Types::STRING, length: 511, nullable: true)]
    private $metaDescription;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\ManyToOne(targetEntity: Media::class)]
    #[ORM\JoinColumn(nullable: true)]
    private $socialImage;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private $fbTitle;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: Types::STRING, length: 511, nullable: true)]
    private $fbDescription;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private $twTitle;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: Types::STRING, length: 511, nullable: true)]
    private $twDescription;

    public function getMetaTitle(): ?string
    {
        return $this->metaTitle;
    }

    public function setMetaTitle(?string $metaTitle): self
    {
        $this->metaTitle = $metaTitle;

        return $this;
    }

    public function getMetaDescription(): ?string
    {
        return $this->metaDescription;
    }

    public function setMetaDescription(?string $metaDescription): self
    {
        $this->metaDescription = $metaDescription;

        return $this;
    }

    public function getSocialImage(): ?Media
    {
        return $this->socialImage;
    }

    public function setSocialImage(?Media $socialImage): self
    {
        $this->socialImage = $socialImage;

        return $this;
    }

    public function getFbTitle(): ?string
    {
        return $this->fbTitle;
    }

    public function setFbTitle(?string $fbTitle): self
    {
        $this->fbTitle = $fbTitle;

        return $this;
    }

    public function getFbDescription(): ?string
    {
        return $this->fbDescription;
    }

    public function setFbDescription(?string $fbDescription): self
    {
        $this->fbDescription = $fbDescription;

        return $this;
    }

    public function getTwTitle(): ?string
    {
        return $this->twTitle;
    }

    public function setTwTitle(?string $twTitle): self
    {
        $this->twTitle = $twTitle;

        return $this;
    }

    public function getTwDescription(): ?string
    {
        return $this->twDescription;
    }

    public function setTwDescription(?string $twDescription): self
    {
        $this->twDescription = $twDescription;

        return $this;
    }

    public function completeFields(string $title = null, string $description = null)
    {
        if (null !== $title) {
            if (null === $this->getMetaTitle()) {
                $this->setMetaTitle($title);
            }

            if (null === $this->getFbTitle()) {
                $this->setFbTitle($title);
            }

            if (null === $this->getTwTitle()) {
                $this->setTwTitle($title);
            }
        }

        if (null !== $description) {
            if (null === $this->getMetaDescription()) {
                $this->setMetaDescription($description);
            }

            if (null === $this->getFbDescription()) {
                $this->setFbDescription($description);
            }

            if (null === $this->getTwDescription()) {
                $this->setTwDescription($description);
            }
        }
    }
}
