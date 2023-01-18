<?php

namespace App\Manager;

use App\Entity\Event\EventCategory;
use App\Entity\Language\Language;
use App\Utils\CloneObject;

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

    public function translateCategory($object, $languageId)
    {
        $newObject = CloneObject::cloneObject($object);
        $parent = $object->getParent();


        if (null !== $parent) {
            $newParent = $this->em->getRepository(EventCategory::class)->findOneByLanguageForAdmin($languageId, $parent->getLanguageGroup()->toBinary());
            if (null === $newParent) {
                return;
            }

            $newObject->setParent($newParent);
        }

        $language = $this->em->getRepository(Language::class)->findOneForAdmin($languageId);
        if (null === $language) {
            return null;
        }

        $newObject->resetChildren();
        $newObject->resetEvents();
        $newObject->resetMainEvents();
        $newObject->setLang($language);

        return $newObject;
    }

    public function getTranslatedCategories($object)
    {
        $results = $this->em->getRepository(EventCategory::class)->findAllByLanguageGroupForAdmin($object->getLanguageGroup()->toBinary());

        return $results;
    }
}
