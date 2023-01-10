<?php

namespace TicketFactory\Module\News\Entity\News;

use App\Entity\Datable;
use App\Entity\Media\Media;
use TicketFactory\Module\News\Repository\NewsRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: NewsRepository::class)]
#[ORM\HasLifecycleCallbacks()]
class News extends Datable
{
    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: Types::STRING, length: 255)]
    private $title;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private $subtitle;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: Types::TEXT)]
    private $description;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: Types::BOOLEAN)]
    private $homeDisplayed;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\ManyToOne(inversedBy: 'newses', targetEntity: Media::class)]
    #[ORM\JoinColumn(nullable: false)]
    private $mainMedia;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\OneToMany(mappedBy: 'news', targetEntity: NewsBlock::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    private $newsBlocks;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    public $frontUrl;

    public function __construct()
    {
        $this->newsBlocks = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getSubtitle(): string
    {
        return $this->subtitle;
    }

    public function setSubtitle(string $subtitle): self
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function isHomeDisplayed(): bool
    {
        return $this->homeDisplayed;
    }

    public function setHomeDisplayed(bool $homeDisplayed): self
    {
        $this->homeDisplayed = $homeDisplayed;

        return $this;
    }

    public function getMainMedia(): ?Media
    {
        return $this->mainMedia;
    }

    public function setMainMedia(?Media $mainMedia): self
    {
        $this->mainMedia = $mainMedia;

        return $this;
    }

    /**
     * @return Collection<int, NewsBlock>
     */
    public function getNewsBlocks(): Collection
    {
        return $this->newsBlocks;
    }

    public function addNewsBlock(NewsBlock $newsBlock): self
    {
        if (!$this->newsBlocks->contains($newsBlock)) {
            $this->newsBlocks->add($newsBlock);
            $newsBlock->setNews($this);
        }

        return $this;
    }

    public function removeNewsBlock(NewsBlock $newsBlock): self
    {
        if ($this->newsBlocks->removeElement($newsBlock)) {
            // set the owning side to null (unless already changed)
            if ($newsBlock->getNews() === $this) {
                $newsBlock->setNews(null);
            }
        }

        return $this;
    }
}
