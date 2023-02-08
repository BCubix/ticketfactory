<?php

namespace App\Entity\Event;

use App\Entity\Language\Language;
use App\Repository\SeatingPlanRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: SeatingPlanRepository::class)]
class SeatingPlan
{
    /*** > Trait ***/
    /*** > Module: ModuleTCE ***/
    use \TicketFactory\Module\ModuleTCE\Entity\Traits\Spectacle\SeatingPlanTrait;
    /*** < Module: ModuleTCE ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du plan doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du plan doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[ORM\ManyToOne(targetEntity: Room::class, inversedBy: 'seatingPlans')]
    #[ORM\JoinColumn(nullable: false)]
    private $room;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(inversedBy: 'seatingPlans')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;


    public function getId(): ?int
    {
        return $this->id;
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

    public function getLanguageGroup(): ?Uuid
    {
        return $this->languageGroup;
    }

    public function setLanguageGroup(?Uuid $languageGroup): self
    {
        $this->languageGroup = $languageGroup;

        return $this;
    }

    public function getRoom(): ?Room
    {
        return $this->room;
    }

    public function setRoom(?Room $room): self
    {
        $this->room = $room;

        return $this;
    }

    public function getLang(): ?Language
    {
        return $this->lang;
    }

    public function setLang(?Language $lang): self
    {
        $this->lang = $lang;

        return $this;
    }
}
