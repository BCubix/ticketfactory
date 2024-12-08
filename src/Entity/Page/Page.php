<?php

namespace App\Entity\Page;

use App\Entity\Content\ContentType;
use App\Entity\Datable;
use App\Entity\SEOAble\SEOAble;
use App\Entity\Language\Language;
use App\Repository\PageRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: PageRepository::class)]
class Page extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    use SEOAble;

    public const STATUS_PUBLISHED = "PUBLISHED";
    public const PUBLICATION_STATUS = [
        'PUBLISHED'   => 'Publié',
        'TO_VALIDATE' => 'À valider',
        'DRAFT' => 'Brouillon'
    ];

    #[JMS\Expose()]
    #[JMS\Groups(['a_content_type_one', 'a_page_all', 'a_page_one', 'a_content_one', 'a_parameter_all', 'a_url_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le titre de la page doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le titre de la page doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_content_type_one', 'a_page_all', 'a_page_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $title;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private $subtitle;

    #[Gedmo\Slug(fields: ['title'], updatable: false)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_page_all', 'a_page_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_all', 'a_page_one'])]
    #[ORM\Column(length: 123, nullable: true)]
    private ?string $keyword = null;

    #[Assert\Choice(callback: 'getPublicationStatusKeys', message: 'Vous devez choisir un status valide.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_page_all', 'a_page_one'])]
    #[ORM\Column(length: 255)]
    private ?string $publicationStatus = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_all', 'a_page_one'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $controller = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_all', 'a_page_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\Valid]
    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one'])]
    #[ORM\OneToMany(mappedBy: 'page', targetEntity: PageBlock::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $pageBlocks;

    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class, orphanRemoval: true)]
    private $pages;

    #[ORM\OneToMany(mappedBy: 'pageParent', targetEntity: ContentType::class, orphanRemoval: true)]
    private $contentTypes;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_all', 'a_page_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one'])]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'pages')]
    private $parent;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all', 'a_page_all', 'a_page_one'])]
    public $frontUrl;


    public function __construct()
    {
        $this->pageBlocks = new ArrayCollection();
        $this->pages = new ArrayCollection();
        $this->contentTypes = new ArrayCollection();
    }

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

    public function getSubtitle(): ?string
    {
        return $this->subtitle;
    }

    public function setSubtitle(?string $subtitle): self
    {
        $this->subtitle = $subtitle;

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

    public function getKeyword(): ?string
    {
        return $this->keyword;
    }

    public function setKeyword(?string $keyword): self
    {
        $this->keyword = $keyword;

        return $this;
    }

    public function getPublicationStatus(): ?string
    {
        return $this->publicationStatus;
    }

    public function setPublicationStatus(string $publicationStatus): static
    {
        $this->publicationStatus = $publicationStatus;

        return $this;
    }

    public function getController(): ?string
    {
        return $this->controller;
    }

    public function setController(?string $controller): self
    {
        $this->controller = $controller;

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

    public function getPageBlocks(): Collection
    {
        return $this->pageBlocks;
    }

    public function addPageBlock(PageBlock $pageBlock): self
    {
        if (!$this->pageBlocks->contains($pageBlock)) {
            $this->pageBlocks[] = $pageBlock;
            $pageBlock->setPage($this);
        }

        return $this;
    }

    public function removePageBlock(PageBlock $pageBlock): self
    {
        if ($this->pageBlocks->removeElement($pageBlock)) {
            if ($pageBlock->getPage() === $this) {
                $pageBlock->setPage(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getPages(): Collection
    {
        return $this->pages;
    }

    public function addPage(self $page): self
    {
        if (!$this->pages->contains($page)) {
            $this->pages->add($page);
            $page->setParent($this);
        }

        return $this;
    }

    public function removePage(self $page): self
    {
        if ($this->pages->removeElement($page)) {
            // set the owning side to null (unless already changed)
            if ($page->getParent() === $this) {
                $page->setParent(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ContentType>
     */
    public function getContentTypes(): Collection
    {
        return $this->contentTypes;
    }

    public function addContentType(ContentType $contentType): self
    {
        if (!$this->contentTypes->contains($contentType)) {
            $this->contentTypes->add($contentType);
            $contentType->setPageParent($this);
        }

        return $this;
    }

    public function removeContentType(ContentType $contentType): self
    {
        if ($this->contentTypes->removeElement($contentType)) {
            // set the owning side to null (unless already changed)
            if ($contentType->getPageParent() === $this) {
                $contentType->setPageParent(null);
            }
        }

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

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): self
    {
        $this->parent = $parent;

        return $this;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function completeSeo()
    {
        $this->completeFields($this->getTitle());
    }

    public function getPublicationStatusKeys()
    {
        return array_keys(self::PUBLICATION_STATUS);
    }
}
