<?php

namespace App\Entity\Content;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Entity\Page\Page;
use App\Entity\SEOAble\SEOAble;
use App\Repository\ContentRepository;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: ContentRepository::class)]
class Content extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    use SEOAble;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le titre du contenu doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le titre du contenu doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one'])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[Gedmo\Slug(fields: ['title'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_content_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_one'])]
    #[ORM\Column]
    private array $fields = [];

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one'])]
    #[ORM\ManyToOne(targetEntity: ContentType::class, inversedBy: 'contents')]
    #[ORM\JoinColumn(nullable: false)]
    private $contentType;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one'])]
    #[ORM\ManyToOne(inversedBy: 'contents')]
    private ?Page $page = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_all', 'a_content_one'])]
    public $frontUrl;


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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;

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

    public function getFields(): array
    {
        return $this->fields;
    }

    public function setFields(array $fields): self
    {
        $this->fields = $fields;

        return $this;
    }

    public function getContentType(): ?ContentType
    {
        return $this->contentType;
    }

    public function setContentType(?ContentType $contentType): self
    {
        $this->contentType = $contentType;

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

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function completeSeo() {
        $this->completeFields($this->getTitle());
    }

    public function getPage(): ?Page
    {
        return $this->page;
    }

    public function setPage(?Page $page): self
    {
        $this->page = $page;

        return $this;
    }
}
