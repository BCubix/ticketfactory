<?php

namespace App\Manager;

use App\Entity\Media\MediaCategory;
use App\Entity\Language\Language;
use App\Utils\CloneObject;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;

class MediaCategoryManager extends AbstractManager
{
    public function deleteMediasFromCategory(MediaCategory $mainCategory): void
    {
        $rootCategory = $this->em->getRepository(MediaCategory::class)->findRootCategory();
        $childrenCategories = $this->em->getRepository(MediaCategory::class)->getChildren($mainCategory, false, null, 'asc', true);

        foreach ($childrenCategories as $category) {
            $medias = $category->getMedias();

            foreach ($medias as $media) {
                $this->em->remove($media);
            }
        }
    }

    public function attachMediasToRootCategory(MediaCategory $mainCategory): void
    {
        $rootCategory = $this->em->getRepository(MediaCategory::class)->findRootCategory();
        $childrenCategories = $this->em->getRepository(MediaCategory::class)->getChildren($mainCategory, false, null, 'asc', true);

        foreach ($childrenCategories as $category) {
            $medias = $category->getMedias();

            foreach ($medias as $media) {
                $media->setMainCategory($rootCategory);
                $this->em->persist($media);
            }
        }
    }

    public function translateCategory(MediaCategory $object, int $languageId)
    {
        $newObject = CloneObject::cloneObject($object);
        $parent = $object->getParent();


        if (null !== $parent) {
            $newParent = $this->em->getRepository(MediaCategory::class)->findOneByLanguageForAdmin($languageId, $parent->getLanguageGroup()->toBinary());
            if (null === $newParent) {
                return null;
            }

            $newObject->setParent($newParent);
        }

        $language = $this->em->getRepository(Language::class)->findOneForAdmin($languageId);
        if (null === $language) {
            return null;
        }

        $newObject->resetChildren();
        $newObject->resetMedias();
        $newObject->resetMainMedias();
        $newObject->setLang($language);

        return $newObject;
    }

    public function getTranslatedCategories(MediaCategory $object): array
    {
        if (!$object->getLang()->isIsDefault()) {
            return [$object];
        }

        return $this->em->getRepository(MediaCategory::class)->findAllByLanguageGroupForAdmin($object->getLanguageGroup()->toBinary());
    }

    public function getTranslatedChildren(?MediaCategory $object, array $filters): ?MediaCategory
    {
        $children = $object->getChildren();

        if (isset($filters['lang']) || count($children) === 0) {
            return $object;
        }

        $children = $this->mf->get('language')->getAllTranslations($children->toArray(), MediaCategory::class, $filters);
        if (null !== $children) {
            $object->setChildren(new ArrayCollection($children));
        }

        return $object;
    }

    public function getHomeWebsiteCategory(): ?MediaCategory
    {
        $lvl = 1;
        $repository = $this->em->getRepository(MediaCategory::class);

        return $repository->findByLvlForWebsite($this->getDefaultLanguageId(), $lvl, 'home-du-site');
    }

    public function getMediasRootCategory($slug = null): array
    {
        $lvl = 1;
        $repository = $this->em->getRepository(MediaCategory::class);
        $rootCategory = $repository->findByLvlForWebsite($this->getDefaultLanguageId(), $lvl, $slug);

        return $repository->findSubCategoriesForWebsite($this->getDefaultLanguageId(), $rootCategory, false);
    }

    public function getSubCategories(MediaCategory $rootCategory): array
    {
        $repository = $this->em->getRepository(MediaCategory::class);

        return $repository->findSubCategoriesForWebsite($this->getLanguageId(), $rootCategory, true);
    }

    public function getCategoryBySlug(string $slug): ?MediaCategory
    {
        return $this->em->getRepository(MediaCategory::class)->findBySlugForWebsite($this->getLanguageId(), $slug);
    }
}
