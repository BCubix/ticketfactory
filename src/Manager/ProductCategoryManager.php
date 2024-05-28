<?php

namespace App\Manager;

use App\Entity\Product\ProductCategory;
use App\Entity\Language\Language;
use App\Entity\Product\Product;
use App\Service\Object\CloneObject;

use Doctrine\Common\Collections\ArrayCollection;

class ProductCategoryManager extends AbstractManager
{
    public const SERVICE_NAME = 'productCategory';

    public function deleteProductsFromCategory(ProductCategory $mainCategory): void
    {
        $rootCategory = $this->em->getRepository(ProductCategory::class)->findRootCategory();
        $childrenCategories = $this->em->getRepository(ProductCategory::class)->getChildren($mainCategory, false, null, 'asc', true);

        $objectsId = [];
        foreach ($childrenCategories as $category) {
            $products = $category->getProducts();

            foreach ($products as $product) {
                $objectsId[] = $product->getId();
                $this->em->remove($product);
            }
        }

        $this->em->flush();

        foreach($objectsId as $id) {
            $this->sf->get('logger')->log(0, 0, 'Deleted object.', Product::class, $id);
        }
    }

    public function attachProductsToRootCategory(ProductCategory $mainCategory): void
    {
        $rootCategory = $this->em->getRepository(ProductCategory::class)->findRootCategory();
        $childrenCategories = $this->em->getRepository(ProductCategory::class)->getChildren($mainCategory, false, null, 'asc', true);

        $objectsId = [];
        foreach ($childrenCategories as $category) {
            $products = $category->getProducts();

            foreach ($products as $product) {
                $objectsId[] = $product->getId();
                $product->setMainCategory($rootCategory);
                $this->em->persist($product);
            }
        }

        $this->em->flush();

        foreach($objectsId as $id) {
            $this->sf->get('logger')->log(0, 0, 'Updated object.', Product::class, $id);
        }
    }

    public function translateCategory(ProductCategory $object, int $languageId)
    {
        $newObject = CloneObject::cloneObject($object);
        $parent = $object->getParent();


        if (null !== $parent) {
            $newParent = $this->em->getRepository(ProductCategory::class)->findOneByLanguageForAdmin($languageId, $parent->getLanguageGroup()->toBinary());
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
        $newObject->resetProducts();
        $newObject->resetMainProducts();
        $newObject->setLang($language);

        return $newObject;
    }

    public function getTranslatedCategories(ProductCategory $object): array
    {
        if (!$object->getLang()->isIsDefault()) {
            return [$object];
        }

        $results = $this->em->getRepository(ProductCategory::class)->findAllByLanguageGroupForAdmin($object->getLanguageGroup()->toBinary());

        return $results;
    }

    public function getTranslatedChildren(ProductCategory $object, array $filters): ProductCategory
    {
        $children = $object->getChildren();

        if (isset($filters['lang']) || count($children) === 0) {
            return $object;
        }

        $children = $this->mf->get('language')->getAllTranslations($children->toArray(), ProductCategory::class, $filters);
        if (null !== $children) {
            $object->setChildren(new ArrayCollection($children));
        }

        return $object;
    }

    public function getTopCategories(): array
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(ProductCategory::class)->getTopCategoriesForWebsite($languageId);
    }

    public function getBySlug($slug): ?ProductCategory
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(ProductCategory::class)->findBySlugForWebsite($languageId, $slug);
    }

    public function orderTranslatedElement(object $element, int $position)
    {
        $translatedObjects = $this->em->getRepository(ProductCategory::class)->findAllTranslationsByElementForAdmin($element->getLanguageGroup()->toBinary());

        if (null === $translatedObjects) {
            return;
        }


        foreach ($translatedObjects as $object) {
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
