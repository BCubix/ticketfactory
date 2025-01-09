<?php

namespace App\Hook;

use App\Entity\Feature\FeatureValue;
use App\Event\HookEvent;
use App\Service\Addon\Hook;

class ProductHook extends Hook
{
    public function hookProductSaved(HookEvent $event)
    {
        $sObject = $event->getParam('sObject');
        $iObject = $event->getParam('iObject');

        $this->mf->get('seo')->completeSeoProduct($sObject);

        if ($iObject->getStock() !== $sObject->getStock()) {
            $this->mf->get('productStockMovement')->newMovement($sObject, $sObject->getStock() - $iObject->getStock(), null);
        }
    }

    public function hookProductValidated(HookEvent $event)
    {
        $vObject = $event->getParam('vObject');

        $featureLinks = $vObject->getFeatureLinks();
        foreach ($featureLinks as $featureLink) {
            if (null === $featureLink->getFeatureValue() && null !== $featureLink->getFeatureValueRaw()) {
                $featureValue = new FeatureValue();
                $featureValue->setCustom(true);
                $featureValue->setValue($featureLink->getFeatureValueRaw());
                $featureValue->setFeature($featureLink->getFeature());

                $featureLink->setFeatureValue($featureValue);
                $featureLink->setFeatureValueRaw("");

                $this->em->persist($featureValue);
                $this->em->persist($featureLink);
            } else if (null !== $featureLink->getFeatureValueRaw() && $featureLink->getFeatureValue()->getValue() !== $featureLink->getFeatureValueRaw()) {
                $featureValue = $featureLink->getFeatureValue();

                $featureValue->setCustom(true);
                $featureValue->setValue($featureLink->getFeatureValueRaw());

                $this->em->persist($featureValue);
            }
        }
    }
}
