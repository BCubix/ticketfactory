<?php

namespace App\Manager;

use App\Entity\Event\EventCategory;
use App\Entity\Language\Language;
use App\Utils\CloneObject;
use App\Manager\LanguageManager;

use Doctrine\Common\Collections\ArrayCollection;
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

    public function translateCategory(EventCategory $object, int $languageId)
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

    public function getTranslatedCategories(EventCategory $object): array
    {
        if (!$object->getLang()->isIsDefault()) {
            return [$object];
        }

        $results = $this->em->getRepository(EventCategory::class)->findAllByLanguageGroupForAdmin($object->getLanguageGroup()->toBinary());

        return $results;
    }

    public function getTranslatedChildren(EventCategory $object, array $filters): EventCategory
    {
        $children = $object->getChildren();

        if (isset($filters['lang']) || count($children) === 0) {
            return $object;
        }

        $children = $this->mf->get('language')->getAllTranslations($children->toArray(), EventCategory::class, $filters);
        if (null !== $children) {
            $object->setChildren(new ArrayCollection($children));
        }

        return $object;
    }

    public function getTopCategories(): array
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(EventCategory::class)->getTopCategoriesForWebsite($languageId);
    }

    public function getBySlug($slug): ?EventCategory
    {
        $languageId = $this->getLanguageId();
        
        return $this->em->getRepository(EventCategory::class)->findBySlugForWebsite($languageId, $slug);
    }
}
