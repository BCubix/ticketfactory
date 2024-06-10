<?php

namespace App\Entity\Url;

use App\Entity\Datable;
use App\Entity\Page\Page;
use App\Repository\UrlRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UrlRepository::class)]
class Url extends Datable
{
    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de l\'url doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de l\'url doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_url_all', 'a_url_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Assert\Length(max: 250, maxMessage: 'Le slug de l\'url doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le slug de l\'url doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_url_all', 'a_url_one'])]
    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_url_all', 'a_url_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $keyword = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_url_all', 'a_url_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $entity = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_url_all', 'a_url_one'])]
    #[ORM\Column(length: 255)]
    private ?string $controller = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_url_all', 'a_url_one'])]
    #[ORM\Column]
    private ?int $position = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_url_all', 'a_url_one'])]
    #[ORM\Column(length: 255)]
    private ?string $urlBuilder = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_url_all', 'a_url_one'])]
    #[ORM\ManyToOne]
    private ?Page $page = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getKeyword(): ?string
    {
        return $this->keyword;
    }

    public function setKeyword(?string $keyword): static
    {
        $this->keyword = $keyword;

        return $this;
    }

    public function getEntity(): ?string
    {
        return $this->entity;
    }

    public function setEntity(string $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function getController(): ?string
    {
        return $this->controller;
    }

    public function setController(string $controller): static
    {
        $this->controller = $controller;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getUrlBuilder(): ?string
    {
        return $this->urlBuilder;
    }

    public function setUrlBuilder(string $urlBuilder): static
    {
        $this->urlBuilder = $urlBuilder;

        return $this;
    }

    public function getPage(): ?Page
    {
        return $this->page;
    }

    public function setPage(?Page $page): static
    {
        $this->page = $page;

        return $this;
    }
}
