<?php

namespace TicketFactory\Module\Info\Entity\Info;

use App\Entity\Datable;
use TicketFactory\Module\Info\Repository\InfoRepository;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: InfoRepository::class)]
class Info extends Datable
{
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le titre de l\'information doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le titre de l\'information doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[Assert\NotBlank(message: 'La description de l\'information doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[Assert\Length(max: 250, maxMessage: 'Le lien doit être inférieur à {{ limit }} caractères.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 255)]
    private ?string $url = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $beginDate = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $endDate = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getBeginDate(): ?\DateTimeInterface
    {
        return $this->beginDate;
    }

    public function setBeginDate(?\DateTimeInterface $beginDate): self
    {
        $this->beginDate = $beginDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeInterface $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }
}
