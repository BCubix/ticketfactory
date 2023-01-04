<?php

namespace App\Entity\Media;

use App\Entity\Datable;
use App\Entity\Event\EventMedia;
use App\Repository\MediaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\Entity(repositoryClass: MediaRepository::class)]
class Media extends Datable
{
    /*** > Trait ***/
    /*** > Module: News ***/
    use \TicketFactory\Module\News\Entity\News\MediaTrait;
    /*** < Module: News ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $alt = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $legend = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $title = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $documentFileName = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $documentType = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $documentSize = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $documentUrl = null;

    #[ORM\OneToMany(mappedBy: 'media', targetEntity: EventMedia::class, orphanRemoval: true)]
    private Collection $eventMedias;

    public function __construct()
    {
        $this->eventMedias = new ArrayCollection();
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

    public function setDocumentType(string $documentType): self
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

    public function setDocumentUrl(string $documentUrl): self
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
}
