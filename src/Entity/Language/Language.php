<?php

namespace App\Entity\Language;

use App\Entity\Content\Content;
use App\Entity\Datable;
use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventDateBlock;
use App\Entity\Event\EventPrice;
use App\Entity\Event\EventPriceBlock;
use App\Entity\Event\Room;
use App\Entity\Event\Season;
use App\Entity\Event\SeatingPlan;
use App\Entity\Event\Tag;
use App\Entity\Media\MediaCategory;
use App\Entity\Menu\MenuEntry;
use App\Entity\Page\Page;
use App\Entity\Page\PageBlock;
use App\Repository\LanguageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: LanguageRepository::class)]
class Language extends Datable
{
    /*** > Trait ***/
    /*** > Module: SliderElement ***/
    use \TicketFactory\Module\SliderElement\Entity\Traits\Language\LanguageTrait;
    /*** < Module: SliderElement ***/
    /*** > Module: ModuleTCE ***/
    use \TicketFactory\Module\ModuleTCE\Entity\Traits\Language\LanguageTrait;
    /*** < Module: ModuleTCE ***/
    /*** > Module: FlashInfo ***/
    use \TicketFactory\Module\FlashInfo\Entity\Language\Override\LanguageTrait;
    /*** < Module: FlashInfo ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column(length: 255)]
    private ?string $isoCode = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    #[ORM\Column]
    private ?bool $isDefault = null;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: Event::class, orphanRemoval: true)]
    private Collection $events;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: Tag::class, orphanRemoval: true)]
    private Collection $tags;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: Room::class, orphanRemoval: true)]
    private Collection $rooms;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: Season::class, orphanRemoval: true)]
    private Collection $seasons;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: Page::class, orphanRemoval: true)]
    private Collection $pages;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: PageBlock::class, orphanRemoval: true)]
    private Collection $pageBlocks;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: Content::class, orphanRemoval: true)]
    private Collection $contents;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: EventDateBlock::class, orphanRemoval: true)]
    private Collection $eventDateBlocks;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: EventDate::class, orphanRemoval: true)]
    private Collection $eventDates;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: EventPriceBlock::class, orphanRemoval: true)]
    private Collection $eventPriceBlocks;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: EventPrice::class, orphanRemoval: true)]
    private Collection $eventPrices;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: SeatingPlan::class, orphanRemoval: true)]
    private Collection $seatingPlans;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: EventCategory::class, orphanRemoval: true)]
    private Collection $eventCategories;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: MenuEntry::class, orphanRemoval: true)]
    private Collection $menuEntries;

    #[ORM\OneToMany(mappedBy: 'lang', targetEntity: MediaCategory::class, orphanRemoval: true)]
    private Collection $mediaCategories;

    public function __construct()
    {
        /*** > Module: SliderElement ***/
        $this->sliderElements = new ArrayCollection();
        /*** < Module: SliderElement ***/
        /*** > Module: ModuleTCE ***/
        $this->spectacleBlogs = new ArrayCollection();
        $this->spectaclePresses = new ArrayCollection();
        /*** < Module: ModuleTCE ***/
        /*** > Module: FlashInfo ***/
        $this->flashInfos = new ArrayCollection();
        /*** < Module: FlashInfo ***/
        $this->events = new ArrayCollection();
        $this->eventCategories = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->rooms = new ArrayCollection();
        $this->seasons = new ArrayCollection();
        $this->pages = new ArrayCollection();
        $this->pageBlocks = new ArrayCollection();
        $this->contents = new ArrayCollection();
        $this->eventDateBlocks = new ArrayCollection();
        $this->eventDates = new ArrayCollection();
        $this->eventPriceBlocks = new ArrayCollection();
        $this->eventPrices = new ArrayCollection();
        $this->seatingPlans = new ArrayCollection();
        $this->menuEntries = new ArrayCollection();
        $this->mediaCategories = new ArrayCollection();
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

    public function getIsoCode(): ?string
    {
        return $this->isoCode;
    }

    public function setIsoCode(string $isoCode): self
    {
        $this->isoCode = $isoCode;

        return $this;
    }

    public function isIsDefault(): ?bool
    {
        return $this->isDefault;
    }

    public function setIsDefault(bool $isDefault): self
    {
        $this->isDefault = $isDefault;

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
            $this->events->add($event);
            $event->setLang($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): self
    {
        if ($this->events->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getLang() === $this) {
                $event->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Tag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): self
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
            $tag->setLang($this);
        }

        return $this;
    }

    public function removeTag(Tag $tag): self
    {
        if ($this->tags->removeElement($tag)) {
            // set the owning side to null (unless already changed)
            if ($tag->getLang() === $this) {
                $tag->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Room>
     */
    public function getRooms(): Collection
    {
        return $this->rooms;
    }

    public function addRoom(Room $room): self
    {
        if (!$this->rooms->contains($room)) {
            $this->rooms->add($room);
            $room->setLang($this);
        }

        return $this;
    }

    public function removeRoom(Room $room): self
    {
        if ($this->rooms->removeElement($room)) {
            // set the owning side to null (unless already changed)
            if ($room->getLang() === $this) {
                $room->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Season>
     */
    public function getSeasons(): Collection
    {
        return $this->seasons;
    }

    public function addSeason(Season $season): self
    {
        if (!$this->seasons->contains($season)) {
            $this->seasons->add($season);
            $season->setLang($this);
        }

        return $this;
    }

    public function removeSeason(Season $season): self
    {
        if ($this->seasons->removeElement($season)) {
            // set the owning side to null (unless already changed)
            if ($season->getLang() === $this) {
                $season->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Page>
     */
    public function getPages(): Collection
    {
        return $this->pages;
    }

    public function addPage(Page $page): self
    {
        if (!$this->pages->contains($page)) {
            $this->pages->add($page);
            $page->setLang($this);
        }

        return $this;
    }

    public function removePage(Page $page): self
    {
        if ($this->pages->removeElement($page)) {
            // set the owning side to null (unless already changed)
            if ($page->getLang() === $this) {
                $page->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PageBlock>
     */
    public function getPageBlocks(): Collection
    {
        return $this->pageBlocks;
    }

    public function addPageBlock(PageBlock $pageBlock): self
    {
        if (!$this->pageBlocks->contains($pageBlock)) {
            $this->pageBlocks->add($pageBlock);
            $pageBlock->setLang($this);
        }

        return $this;
    }

    public function removePageBlock(PageBlock $pageBlock): self
    {
        if ($this->pageBlocks->removeElement($pageBlock)) {
            // set the owning side to null (unless already changed)
            if ($pageBlock->getLang() === $this) {
                $pageBlock->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Content>
     */
    public function getContents(): Collection
    {
        return $this->contents;
    }

    public function addContent(Content $content): self
    {
        if (!$this->contents->contains($content)) {
            $this->contents->add($content);
            $content->setLang($this);
        }

        return $this;
    }

    public function removeContent(Content $content): self
    {
        if ($this->contents->removeElement($content)) {
            // set the owning side to null (unless already changed)
            if ($content->getLang() === $this) {
                $content->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EventDateBlock>
     */
    public function getEventDateBlocks(): Collection
    {
        return $this->eventDateBlocks;
    }

    public function addEventDateBlock(EventDateBlock $eventDateBlock): self
    {
        if (!$this->eventDateBlocks->contains($eventDateBlock)) {
            $this->eventDateBlocks->add($eventDateBlock);
            $eventDateBlock->setLang($this);
        }

        return $this;
    }

    public function removeEventDateBlock(EventDateBlock $eventDateBlock): self
    {
        if ($this->eventDateBlocks->removeElement($eventDateBlock)) {
            // set the owning side to null (unless already changed)
            if ($eventDateBlock->getLang() === $this) {
                $eventDateBlock->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EventDate>
     */
    public function getEventDates(): Collection
    {
        return $this->eventDates;
    }

    public function addEventDate(EventDate $eventDate): self
    {
        if (!$this->eventDates->contains($eventDate)) {
            $this->eventDates->add($eventDate);
            $eventDate->setLang($this);
        }

        return $this;
    }

    public function removeEventDate(EventDate $eventDate): self
    {
        if ($this->eventDates->removeElement($eventDate)) {
            // set the owning side to null (unless already changed)
            if ($eventDate->getLang() === $this) {
                $eventDate->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EventPriceBlock>
     */
    public function getEventPriceBlocks(): Collection
    {
        return $this->eventPriceBlocks;
    }

    public function addEventPriceBlock(EventPriceBlock $eventPriceBlock): self
    {
        if (!$this->eventPriceBlocks->contains($eventPriceBlock)) {
            $this->eventPriceBlocks->add($eventPriceBlock);
            $eventPriceBlock->setLang($this);
        }

        return $this;
    }

    public function removeEventPriceBlock(EventPriceBlock $eventPriceBlock): self
    {
        if ($this->eventPriceBlocks->removeElement($eventPriceBlock)) {
            // set the owning side to null (unless already changed)
            if ($eventPriceBlock->getLang() === $this) {
                $eventPriceBlock->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EventPrice>
     */
    public function getEventPrices(): Collection
    {
        return $this->eventPrices;
    }

    public function addEventPrice(EventPrice $eventPrice): self
    {
        if (!$this->eventPrices->contains($eventPrice)) {
            $this->eventPrices->add($eventPrice);
            $eventPrice->setLang($this);
        }

        return $this;
    }

    public function removeEventPrice(EventPrice $eventPrice): self
    {
        if ($this->eventPrices->removeElement($eventPrice)) {
            // set the owning side to null (unless already changed)
            if ($eventPrice->getLang() === $this) {
                $eventPrice->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SeatingPlan>
     */
    public function getSeatingPlans(): Collection
    {
        return $this->seatingPlans;
    }

    public function addSeatingPlan(SeatingPlan $seatingPlan): self
    {
        if (!$this->seatingPlans->contains($seatingPlan)) {
            $this->seatingPlans->add($seatingPlan);
            $seatingPlan->setLang($this);
        }

        return $this;
    }

    public function removeSeatingPlan(SeatingPlan $seatingPlan): self
    {
        if ($this->seatingPlans->removeElement($seatingPlan)) {
            // set the owning side to null (unless already changed)
            if ($seatingPlan->getLang() === $this) {
                $seatingPlan->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, EventCategory>
     */
    public function getEventCategories(): Collection
    {
        return $this->eventCategories;
    }

    public function addEventCategory(EventCategory $eventCategory): self
    {
        if (!$this->eventCategories->contains($eventCategory)) {
            $this->eventCategories->add($eventCategory);
            $eventCategory->setLang($this);
        }

        return $this;
    }

    public function removeEventCategory(EventCategory $eventCategory): self
    {
        if ($this->eventCategories->removeElement($eventCategory)) {
            // set the owning side to null (unless already changed)
            if ($eventCategory->getLang() === $this) {
                $eventCategory->setLang(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, MenuEntry>
     */
    public function getMenuEntries(): Collection
    {
        return $this->menuEntries;
    }

    public function addMenuEntry(MenuEntry $menuEntry): self
    {
        if (!$this->menuEntries->contains($menuEntry)) {
            $this->menuEntries->add($menuEntry);
            $menuEntry->setLang($this);
        }

        return $this;
    }

    public function removeMenuEntry(MenuEntry $menuEntry): self
    {
        if ($this->menuEntries->removeElement($menuEntry)) {
            // set the owning side to null (unless already changed)
            if ($menuEntry->getLang() === $this) {
                $menuEntry->setLang(null);
            }
        }

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
            $mediaCategory->setLang($this);
        }

        return $this;
    }

    public function removeMediaCategory(MediaCategory $mediaCategory): self
    {
        if ($this->mediaCategories->removeElement($mediaCategory)) {
            // set the owning side to null (unless already changed)
            if ($mediaCategory->getLang() === $this) {
                $mediaCategory->setLang(null);
            }
        }

        return $this;
    }
}
