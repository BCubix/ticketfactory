<?php

namespace App\Hook;

use App\Entity\Product\ProductCategory;
use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;
use Symfony\Component\HttpFoundation\Response;

class ProductCategoryHook extends Hook
{
    public function hookProductCategorySaved(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'add') {
            return;
        }

        $productCategory = $event->getParam('sObject');
        $parentId = $productCategory->getParent()->getId();

        if ($productCategory->getPosition() > 0) {
            return;
        }

        $maxPosition = $this->em->getRepository(ProductCategory::class)->findMaxPositionForAdmin($parentId);

        if (null === $maxPosition || count($maxPosition) === 0) {
            $productCategory->setPosition(1);
        } else {
            $productCategory->setPosition($maxPosition[0]->getPosition() + 1);
        }

        $this->em->persist($productCategory);
        $this->em->flush();

        $this->mf->get('seo')->completeSeoProductCategory($productCategory);
    }

    public function hookProductCategoryValidated(HookEvent $event)
    {
        $vObject = $event->getParam('vObject');
        $eventCategoryId = $vObject->getId();

        $eventCategory = $vObject->getParent();
        while (null !== $eventCategory) {
            if ($eventCategory->getId() === $eventCategoryId) {
                throw  new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'La catégorie courante ne peut être située à plusieurs endroits dans l\'arborescence.');
            }
            $eventCategory = $eventCategory->getParent();
        }
    }
}
