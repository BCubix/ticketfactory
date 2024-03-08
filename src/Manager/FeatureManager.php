<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Entity\Feature\FeatureLink;
use App\Entity\Product\Product;

class FeatureManager extends AbstractManager
{
    public const SERVICE_NAME = 'feature';

    public function getEventFeatures(Event $event, string $categoryKeyword = null, string $featureKeyword = null)
    {
        return $this->em->getRepository(FeatureLink::class)->findAllFeatureLinksByEventForWebsite($event->getId(), $categoryKeyword, $featureKeyword);
    }

    public function getProductFeatures(Product $product, string $categoryKeyword = null, string $featureKeyword = null): array
    {
        return $this->em->getRepository(FeatureLink::class)->findAllFeatureLinksByProductForWebsite($product->getId(), $categoryKeyword, $featureKeyword);
    }
}
