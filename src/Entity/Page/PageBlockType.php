<?php

namespace App\Entity\Page;

use App\Entity\Content\ContentTypeField;
use App\Entity\Datable;
use App\Entity\JsonDoctrineSerializable;
use App\Repository\PageBlockTypeRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: PageBlockTypeRepository::class)]
class PageBlockType extends Datable implements JsonDoctrineSerializable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_block_type_all', 'a_page_block_type_one', 'a_page_block_all', 'a_page_block_one', 'a_page_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_block_type_all', 'a_page_block_type_one', 'a_page_block_all', 'a_page_block_one', 'a_page_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_block_type_all', 'a_page_block_type_one', 'a_page_block_all', 'a_page_block_one', 'a_page_one'])]
    #[ORM\Column(length: 123, nullable: true, unique: true)]
    private ?string $keyword = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_block_type_all', 'a_page_block_type_one', 'a_page_block_all', 'a_page_block_one', 'a_page_one'])]
    #[ORM\Column(type: 'json')]
    private array $fields = [];

    /**
     * @var Collection<int, PageBlock>
     */
    #[JMS\Expose()]
    #[JMS\Groups(['a_page_block_type_all', 'a_page_block_type_one'])]
    #[ORM\OneToMany(mappedBy: 'pageBlockType', targetEntity: PageBlock::class)]
    private Collection $pageBlocks;

    public function __construct()
    {
        $this->pageBlocks = new ArrayCollection();
    }

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

    public function getKeyword(): ?string
    {
        return $this->keyword;
    }

    public function setKeyword(?string $keyword): static
    {
        $this->keyword = $keyword;

        return $this;
    }

    public function getFields(): array
    {
        return $this->fields;
    }

    public function setFields(array $fields): static
    {
        $this->fields = $fields;

        return $this;
    }

    /**
     * @return Collection<int, PageBlock>
     */
    public function getPageBlocks(): Collection
    {
        return $this->pageBlocks;
    }

    public function addPageBlock(PageBlock $pageBlock): static
    {
        if (!$this->pageBlocks->contains($pageBlock)) {
            $this->pageBlocks->add($pageBlock);
            $pageBlock->setPageBlockType($this);
        }

        return $this;
    }

    public function removePageBlock(PageBlock $pageBlock): static
    {
        if ($this->pageBlocks->removeElement($pageBlock)) {
            // set the owning side to null (unless already changed)
            if ($pageBlock->getPageBlockType() === $this) {
                $pageBlock->setPageBlockType(null);
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

    public function toStringToCompare(): array
    {
        return [
            'id'     => $this->id,
            'fields' => $this->fields
        ];
    }
}
