<?php

namespace App\Entity\Content;

use App\Entity\Datable;
use App\Entity\JsonDoctrineSerializable;
use App\Repository\ContentTypeRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContentTypeRepository::class)]
class ContentType extends Datable implements JsonDoctrineSerializable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du type de contenu doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du type de contenu doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'json')]
    private array $fields = [];

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'contentType', targetEntity: Content::class)]
    private $contents;


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
}
