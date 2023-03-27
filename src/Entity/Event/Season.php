<?php

namespace App\Entity\Event;

use App\Entity\Datable;
use App\Entity\Language\Language;
use App\Entity\SEOAble\SEOAble;
use App\Repository\SeasonRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: SeasonRepository::class)]
class Season extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    use SEOAble;

    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one', 'a_season_all', 'a_season_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Assert\Length(max: 250, maxMessage: 'Le nom de la saison doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom de la saison doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_event_all', 'a_event_one', 'a_season_all', 'a_season_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[Gedmo\Slug(fields: ['name'], updatable: true)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_season_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_season_all', 'a_season_one'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $languageGroup = null;

    #[Assert\GreaterThan(value: "1970", message: 'Vous devez renseigner une année de saison valide.')]
    #[Assert\NotBlank(message: 'L\'année de début de saison doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_season_one'])]
    #[ORM\Column(type: 'integer')]
    private $beginYear;

    #[ORM\OneToMany(mappedBy: 'season', targetEntity: Event::class)]
    private $events;

    #[JMS\Expose()]
    #[JMS\Groups(['a_season_all', 'a_season_one'])]
    #[ORM\ManyToOne(inversedBy: 'seasons')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Language $lang = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_season_all', 'a_season_one'])]
    public $frontUrl;


    public function __construct()
    {
        $this->events = new ArrayCollection();
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

    public function getBeginYear(): ?int
    {
        return $this->beginYear;
    }

    public function setBeginYear(int $beginYear): self
    {
        $this->beginYear = $beginYear;

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): self
    {
        if (!$this->events->contains($event)) {
            $this->events[] = $event;
            $event->setSeason($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getSeason() === $this) {
                $event->setSeason(null);
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

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function completeSeo() {
        $this->completeFields($this->getTitle());
    }
}
