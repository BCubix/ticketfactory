<?php

namespace TicketFactory\Module\News\Entity\News;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

trait MediaTrait
{
    #[ORM\OneToMany(mappedBy: 'mainMedia', targetEntity: News::class)]
    private $newses;

    public function __construct()
    {
        $this->newses = new ArrayCollection();
    }

    /**
     * @return Collection<int, News>
     */
    public function getNewses(): Collection
    {
        return $this->newses;
    }

    public function addNewse(News $newse): self
    {
        if (!$this->newses->contains($newse)) {
            $this->newses->add($newse);
            $newse->setMainMedia($this);
        }

        return $this;
    }

    public function removeNewse(News $newse): self
    {
        if ($this->newses->removeElement($newse)) {
            // set the owning side to null (unless already changed)
            if ($newse->getMainMedia() === $this) {
                $newse->setMainMedia(null);
            }
        }

        return $this;
    }
}