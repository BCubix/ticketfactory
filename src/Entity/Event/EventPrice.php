<?php

namespace App\Entity\Event;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity]
class EventPrice
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du tarif doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du tarif doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $annotation;

    #[Assert\PositiveOrZero(message: 'Le tarif doit être un nombre supérieur ou égal à 0.')]
    #[Assert\NotBlank(message: 'Le tarif doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'float')]
    private $price;

    #[ORM\ManyToOne(targetEntity: EventPriceBlock::class, inversedBy: 'eventPrices')]
    #[ORM\JoinColumn(nullable: false)]
    private $eventPriceBlock;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getAnnotation(): ?string
    {
        return $this->annotation;
    }

    public function setAnnotation(?string $annotation): self
    {
        $this->annotation = $annotation;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getEventPriceBlock(): ?EventPriceBlock
    {
        return $this->eventPriceBlock;
    }

    public function setEventPriceBlock(?EventPriceBlock $eventPriceBlock): self
    {
        $this->eventPriceBlock = $eventPriceBlock;

        return $this;
    }
}
