<?php

namespace App\Entity\Media;

use App\Entity\Datable;
use App\Entity\Event\EventMedia;
use App\Repository\MediaRepository;
use App\Utils\MimeTypeMapping;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: MediaRepository::class)]
class Media extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_article_one', 'a_event_one', 'a_media_one', 'a_media_all'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $alt = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_article_one', 'a_event_one', 'a_media_one', 'a_media_all'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_article_one', 'a_event_one', 'a_media_one', 'a_media_all'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $legend = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $title = null;

    #[Gedmo\Slug(fields: ['title'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(length: 123, unique: false)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $subtitle = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_one', 'a_media_one', 'a_media_all'])]
    #[ORM\Column(type: Types::BOOLEAN)]
    private $iframe = false;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_one', 'a_article_one', 'a_event_one'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $documentFileName = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $documentType = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_article_one', 'a_event_one', 'a_media_one'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $documentSize = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[ORM\Column(type: 'string', length: 2047)]
    private ?string $documentUrl = null;

    #[ORM\OneToMany(mappedBy: 'media', targetEntity: EventMedia::class, orphanRemoval: true)]
    private Collection $eventMedias;

    #[ORM\OneToMany(mappedBy: 'thumbnail', targetEntity: self::class)]
    private Collection $mediaThumbnail;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_one'])]
    #[ORM\ManyToOne(targetEntity: MediaCategory::class, inversedBy: 'mainMedias')]
    private $mainCategory;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_one'])]
    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'mediaThumbnail')]
    private ?self $thumbnail = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_media_one'])]
    #[ORM\ManyToMany(targetEntity: MediaCategory::class, inversedBy: 'medias')]
    private $mediaCategories;


    public function __construct()
    {
        $this->eventMedias = new ArrayCollection();
        $this->mediaCategories = new ArrayCollection();
        $this->mediaThumbnail = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAlt(): ?string
    {
        return $this->alt;
    }

    public function setAlt(?string $alt): self
    {
        $this->alt = $alt;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getLegend(): ?string
    {
        return $this->legend;
    }

    public function setLegend(?string $legend): self
    {
        $this->legend = $legend;

        return $this;
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

    public function getSubtitle(): ?string
    {
        return $this->subtitle;
    }

    public function setSubtitle(?string $subtitle): self
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    public function isIframe(): bool
    {
        return $this->iframe;
    }

    public function setIframe(?bool $iframe): self
    {
        $this->iframe = $iframe;

        return $this;
    }

    public function getDocumentFileName(): ?string
    {
        return $this->documentFileName;
    }

    public function setDocumentFileName(string $documentFileName): self
    {
        $this->documentFileName = $documentFileName;

        return $this;
    }

    public function getDocumentType(): ?string
    {
        return $this->documentType;
    }

    public function setDocumentType(?string $documentType): self
    {
        $this->documentType = $documentType;

        return $this;
    }

    public function getDocumentSize(): ?string
    {
        return $this->documentSize;
    }

    public function setDocumentSize(string $documentSize): self
    {
        $this->documentSize = $documentSize;

        return $this;
    }

    public function getDocumentUrl(): ?string
    {
        return $this->documentUrl;
    }

    public function setDocumentUrl(?string $documentUrl): self
    {
        $this->documentUrl = $documentUrl;

        return $this;
    }

    /**
     * @return Collection<int, EventMedia>
     */
    public function getEventMedias(): Collection
    {
        return $this->eventMedias;
    }

    public function addEventMedia(EventMedia $eventMedia): self
    {
        if (!$this->eventMedias->contains($eventMedia)) {
            $this->eventMedias->add($eventMedia);
            $eventMedia->setMedia($this);
        }

        return $this;
    }

    public function removeEventMedia(EventMedia $eventMedia): self
    {
        if ($this->eventMedias->removeElement($eventMedia)) {
            // set the owning side to null (unless already changed)
            if ($eventMedia->getMedia() === $this) {
                $eventMedia->setMedia(null);
            }
        }

        return $this;
    }


        /**
     * @return Collection<int, self>
     */
    public function getMediaThumbnail(): Collection
    {
        return $this->mediaThumbnail;
    }

    public function addMediaThumbnail(self $mediaThumbnail): self
    {
        if (!$this->mediaThumbnail->contains($mediaThumbnail)) {
            $this->mediaThumbnail->add($mediaThumbnail);
            $mediaThumbnail->setThumbnail($this);
        }

        return $this;
    }

    public function removeMediaThumbnail(self $mediaThumbnail): self
    {
        if ($this->mediaThumbnail->removeElement($mediaThumbnail)) {
            // set the owning side to null (unless already changed)
            if ($mediaThumbnail->getThumbnail() === $this) {
                $mediaThumbnail->setThumbnail(null);
            }
        }

        return $this;
    }

    public function getMainCategory(): ?MediaCategory
    {
        return $this->mainCategory;
    }

    public function setMainCategory(?MediaCategory $mainCategory): self
    {
        $this->mainCategory = $mainCategory;

        return $this;
    }

    public function getThumbnail(): ?self
    {
        return $this->thumbnail;
    }

    public function setThumbnail(?self $thumbnail): self
    {
        $this->thumbnail = $thumbnail;

        return $this;
    }

    /**
     * @return Collection<int, MediaCategory>
     */
    public function getMediaCategories(): Collection
    {
        return $this->mediaCategories;
    }

    public function addMediaCategory(MediaCategory $mediaCategory): self
    {
        if (!$this->mediaCategories->contains($mediaCategory)) {
            $this->mediaCategories->add($mediaCategory);
        }

        return $this;
    }

    public function removeMediaCategory(MediaCategory $mediaCategory): self
    {
        $this->mediaCategories->removeElement($mediaCategory);

        return $this;
    }

    public function getRealType(): string
    {
        $type = MimeTypeMapping::getTypeFromMime($this->getDocumentType());
        $type = iconv("utf-8", "ascii//TRANSLIT", $type);
        $type = strtolower($type);

        if (in_array($type, ['image', 'audio', 'video'])) {
            return $type;
        }

        return 'text';
    }

    public function isYoutube()
    {
        return preg_match('#youtube\.com#i', $this->getDocumentUrl());
    }

    #[JMS\Expose()]
    #[JMS\Groups(['a_all'])]
    #[JMS\SerializedName("realThumbnail")]
    #[JMS\VirtualProperty()]
    public function getRealThumbnail($quality = 'maxresdefault'): ?string
    {
        if (null !== $this->getThumbnail()) {
            return $this->getThumbnail()->getDocumentUrl();
        }

        $matches = [];
        if (preg_match('#youtube.com/watch\?v=([a-zA-Z0-9_\-]+)#is', $this->getDocumentUrl(), $matches)) {
            return 'https://img.youtube.com/vi/' . $matches[1] . '/' . $quality . '.jpg';
        }

        if (preg_match('#youtube.com/embed/([a-zA-Z0-9_\-]+)#is', $this->getDocumentUrl(), $matches)) {
            return 'https://img.youtube.com/vi/' . $matches[1] . '/' . $quality . '.jpg';
        }

        if (preg_match('#youtu\.be/([a-zA-Z0-9_\-]+)#is', $this->getDocumentUrl(), $matches)) {
            return 'https://img.youtube.com/vi/' . $matches[1] . '/' . $quality . '.jpg';
        }

        if ($this->getRealType() == 'image') {
            return $this->getDocumentUrl();
        }

        return null;
    }

}
