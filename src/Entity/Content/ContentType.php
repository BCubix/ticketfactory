<?php

namespace App\Entity\Content;

use App\Entity\Datable;
use App\Entity\JsonDoctrineSerializable;
use App\Entity\Page\Page;
use App\Repository\ContentTypeRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: ContentTypeRepository::class)]
class ContentType extends Datable implements JsonDoctrineSerializable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one', 'a_content_type_all', 'a_content_type_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du type de contenu doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du type de contenu doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one', 'a_content_type_all', 'a_content_type_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one', 'a_content_type_all', 'a_content_type_one'])]
    #[ORM\Column]
    private ?bool $pageType = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one', 'a_content_type_all', 'a_content_type_one'])]
    #[ORM\Column]
    private ?bool $displayBlocks = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one', 'a_content_type_all', 'a_content_type_one'])]
    #[ORM\Column(nullable: true)]
    private ?int $maxObjectNb = null;

    #[ORM\Column(length: 191, nullable: true, unique: true)]
    private ?string $keyword = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_one', 'a_content_type_one'])]
    #[ORM\Column(type: 'json')]
    private array $fields = [];

    #[ORM\OneToMany(mappedBy: 'contentType', targetEntity: Content::class)]
    private $contents;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_type_one'])]
    #[ORM\ManyToOne(targetEntity: Page::class, inversedBy: 'contentTypes')]
    #[ORM\JoinColumn(nullable: true)]
    private $pageParent;


    public function __construct()
    {
        $this->active   = true;
        $this->contents = new ArrayCollection();
    }


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

    public function isPageType(): ?bool
    {
        return $this->pageType;
    }

    public function setPageType(bool $pageType): self
    {
        $this->pageType = $pageType;

        return $this;
    }

    public function isDisplayBlocks(): ?bool
    {
        return $this->displayBlocks;
    }

    public function setDisplayBlocks(bool $displayBlocks): self
    {
        $this->displayBlocks = $displayBlocks;

        return $this;
    }

    public function getMaxObjectNb(): ?int
    {
        return $this->maxObjectNb;
    }

    public function setMaxObjectNb(?int $maxObjectNb): self
    {
        $this->maxObjectNb = $maxObjectNb;

        return $this;
    }

    public function getKeyword(): ?string
    {
        return $this->keyword;
    }

    public function setKeyword(?string $keyword): self
    {
        $this->keyword = $keyword;

        return $this;
    }

    public function getFields(): array
    {
        return $this->fields;
    }

    public function setFields(array $fields): self
    {
        $this->fields = $fields;

        return $this;
    }

    /**
     * @return Collection<int, Content>
     */
    public function getContents(): Collection
    {
        return $this->contents;
    }

    public function addContent(Content $content): self
    {
        if (!$this->contents->contains($content)) {
            $this->contents[] = $content;
            $content->setContentType($this);
        }

        return $this;
    }

    public function removeContent(Content $content): self
    {
        if ($this->contents->removeElement($content)) {
            // set the owning side to null (unless already changed)
            if ($content->getContentType() === $this) {
                $content->setContentType(null);
            }
        }

        return $this;
    }

    public function jsonSerialize(): mixed
    {
        $fields = [];
        foreach ($this->fields as $field) {
            $fields[] = $field->jsonSerialize();
        }

        $this->fields = $fields;

        return $this->fields;
    }

    public static function jsonDeserialize($data): self
    {
        $fields = [];
        foreach ($data->fields as $field) {
            $fields[] = ContentTypeField::jsonDeserialize($field);
        }

        $data->fields = $fields;

        return $data;
    }

    public function getPageParent(): ?Page
    {
        return $this->pageParent;
    }

    public function setPageParent(?Page $pageParent): self
    {
        $this->pageParent = $pageParent;

        return $this;
    }
}
