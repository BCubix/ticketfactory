<?php

namespace App\Manager;

use App\Entity\Event\EventCategory;

use Doctrine\ORM\EntityManagerInterface;

class EventCategoryManager extends AbstractManager
{
    public function deleteEventsFromCategory(EventCategory $mainCategory): void
    {
        $rootCategory = $this->em->getRepository(EventCategory::class)->findRootCategory();
        $childrenCategories = $this->em->getRepository(EventCategory::class)->getChildren($mainCategory, false, null, 'asc', true);

        foreach ($childrenCategories as $category) {
            $events = $category->getEvents();

            foreach ($events as $event) {
                $this->em->remove($event);
            }
        }
    }

    public function attachEventsToRootCategory(EventCategory $mainCategory): void
    {
        $rootCategory = $this->em->getRepository(EventCategory::class)->findRootCategory();
        $childrenCategories = $this->em->getRepository(EventCategory::class)->getChildren($mainCategory, false, null, 'asc', true);

        foreach ($childrenCategories as $category) {
            $events = $category->getEvents();

            foreach ($events as $event) {
                $event->setMainCategory($rootCategory);
                $this->em->persist($event);
            }
        }
    }
}
