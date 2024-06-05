<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Language\Language;
use App\Entity\Page\Page;
use App\Service\Object\CloneObject;

use Doctrine\Common\Collections\ArrayCollection;

class EventCategoryManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'eventCategory';

    protected const ENTITY_CLASS = EventCategory::class;

    protected function getContentLinkTab(): array
    {
        return [];
    }

    protected function getAttachedPage(): ?Page
    {
        return $this->mf->get('parameter')->getCoreParameter('page_eventCategory');
    }

    public function deleteEventsFromCategory(EventCategory $mainCategory): void
    {
        $childrenCategories = $this->em->getRepository(EventCategory::class)->getChildren($mainCategory, false, null, 'asc', true);

        $objectsId = [];
        foreach ($childrenCategories as $category) {
            $events = $category->getEvents();

            foreach ($events as $event) {
                $objectsId[] = $event->getId();
                $this->em->remove($event);
            }
        }

        $this->em->flush();

        foreach($objectsId as $id) {
            $this->sf->get('logger')->log(0, 0, 'Deleted object.', Event::class, $id);
        }
    }

    public function attachEventsToRootCategory(EventCategory $mainCategory): void
    {
        $rootCategory = $this->em->getRepository(EventCategory::class)->findRootCategory();
        $childrenCategories = $this->em->getRepository(EventCategory::class)->getChildren($mainCategory, false, null, 'asc', true);

        $objectsId = [];
        foreach ($childrenCategories as $category) {
            $events = $category->getEvents();

            foreach ($events as $event) {
                $objectsId[] = $event->getId();
                $event->setMainCategory($rootCategory);
                $this->em->persist($event);
            }
        }

        $this->em->flush();

        foreach($objectsId as $id) {
            $this->sf->get('logger')->log(0, 0, 'Updated object.', Event::class, $id);
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

    public function orderTranslatedElement(object $element, int $position)
    {
        $translatedObjects = $this->em->getRepository(EventCategory::class)->findAllTranslationsByElementForAdmin($element->getLanguageGroup()->toBinary());

        if (null === $translatedObjects) {
            return;
        }


        foreach($translatedObjects as $object) {
            $object->setPosition($position);
            $this->em->persist($object);
        }
    }

    public function orderCategoriesElementsList(array $list, int $srcPosition, int $destPosition)
    {
        if ($srcPosition > $destPosition) {
            // Up position all element between dest include to src exclude
            for ($i = $destPosition; $i < $srcPosition; ++$i) {
                $list[$i - 1]->setPosition($i + 1);
                $this->em->persist($list[$i - 1]);

                $this->orderTranslatedElement($list[$i - 1], $i + 1);

            }
        } else {
            // Down position of all element between src exclude to dest include
            for ($i = $srcPosition + 1; $i < $destPosition + 1; ++$i) {
                $list[$i - 1]->setPosition($i - 1);
                $this->em->persist($list[$i - 1]);

                $this->orderTranslatedElement($list[$i - 1], $i - 1);
            }
        }

        // Update new position of the src element
        $list[$srcPosition - 1]->setPosition($destPosition);
        $this->em->persist($list[$srcPosition - 1]);

        $this->orderTranslatedElement($list[$srcPosition - 1], $destPosition);
    }
}
