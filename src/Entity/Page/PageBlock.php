<?php

namespace App\Entity\Page;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Repository\PageBlockRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: PageBlockRepository::class)]
class PageBlock extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\NotBlank(message: 'Le nom du bloc doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\NotNull(message: 'Cet élément doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    #[ORM\Column]
    private ?bool $saveAsModel = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    #[ORM\Column(type: Types::INTEGER)]
    private $blockType;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    #[ORM\Column(type: 'json')]
    private array $columns = [];

    #[ORM\ManyToOne(targetEntity: Page::class, inversedBy: 'pageBlocks')]
    private $page;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;


    public function __construct()
    {
        $this->active  = true;
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

    public function getLanguageGroup(): ?Uuid
    {
        return $this->languageGroup;
    }

    public function setLanguageGroup(?Uuid $languageGroup): self
    {
        $this->languageGroup = $languageGroup;

        return $this;
    }

    public function isSaveAsModel(): ?bool
    {
        return $this->saveAsModel;
    }

    public function setSaveAsModel(bool $saveAsModel): self
    {
        $this->saveAsModel = $saveAsModel;

        return $this;
    }

    public function getBlockType(): ?int
    {
        return $this->blockType;
    }

    public function setBlockType(int $blockType): self
    {
        $this->blockType = $blockType;

        return $this;
    }

    public function getColumns(): array
    {
        return $this->columns;
    }

    public function setColumns(array $columns): self
    {
        $this->columns = $columns;

        return $this;
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
