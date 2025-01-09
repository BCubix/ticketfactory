<?php

namespace App\Entity\Page;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Repository\PageBlockRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
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
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\Column]
    private ?bool $saveAsModel = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\Column(type: 'json')]
    private array $columns = [];

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\Column]
    private array $fields = [];

    #[ORM\ManyToOne(targetEntity: Page::class, inversedBy: 'pageBlocks')]
    private $page;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\ManyToOne(targetEntity: Language::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\Column(length: 255)]
    private ?string $class = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_all', 'a_page_block_one'])]
    #[ORM\ManyToOne(inversedBy: 'pageBlocks')]
    private ?PageBlockType $pageBlockType = null;


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

    public function getColumns(): array
    {
        return $this->columns;
    }

    public function setColumns(array $columns): self
    {
        $this->columns = $columns;

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

    public function getClass(): ?string
    {
        return $this->class;
    }

    public function setClass(string $class): self
    {
        $this->class = $class;

        return $this;
    }

    public function getPageBlockType(): ?PageBlockType
    {
        return $this->pageBlockType;
    }

    public function setPageBlockType(?PageBlockType $pageBlockType): static
    {
        $this->pageBlockType = $pageBlockType;

        return $this;
    }

    public function toStringToCompare(): array
    {
        $result = [
            'name'          => $this->name,
            'saveAsModel'   => $this->saveAsModel,
            'class'         => $this->class,
            'pageBlockType' => null !== $this->pageBlockType ? $this->pageBlockType->toStringToCompare() : null,
            'fields'        => $this->fields,
            'columns'       => [],
        ];

        foreach ($this->columns as $column) {
            $result['columns'][] = PageColumn::toStringToCompare($column);
        }

        return $result;
    }

    public function __clone()
    {
        $this->columns = array_map(fn($item) => is_object($item) ? clone $item : $item, $this->columns);
        $this->fields = array_map(fn($item) => is_object($item) ? clone $item : $item, $this->fields);
    }

    public function restoreHistory(array $fields): self
    {
        if (isset($fields['name'])) {
            $this->name = $fields['name'];
        }

        if (isset($fields['saveAsModel'])) {
            $this->saveAsModel = $fields['saveAsModel'];
        }

        if (isset($fields['class'])) {
            $this->class = $fields['class'];
        }

        if (isset($fields['fields'])) {
            $this->fields = array_replace_recursive($this->fields, $fields['fields']);
        }

        if (isset($fields['columns'])) {
            $this->columns = array_replace_recursive($this->columns, $fields['columns']);
        }

        return $this;
    }
}
