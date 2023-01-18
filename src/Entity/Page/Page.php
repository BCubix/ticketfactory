<?php

namespace App\Entity\Page;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Repository\PageRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: PageRepository::class)]
class Page extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le titre de la page doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le titre de la page doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $title;

    #[Gedmo\Slug(fields: ['title'], updatable: false)]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\Valid]
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'page', targetEntity: PageBlock::class, orphanRemoval: true, cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $pageBlocks;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(inversedBy: 'pages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    public $frontUrl;


    public function __construct()
    {
        $this->pageBlocks = new ArrayCollection();
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
