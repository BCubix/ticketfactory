<?php

namespace App\Hook;

use App\Entity\Feature\FeatureValue;
use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;

use Symfony\Component\HttpFoundation\Response;

class EventHook extends Hook
{
    public function hookEventSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        //$this->mf->get('versionnedEntity')->checkVersionnedEntity($sObject, $iObject);

        $this->mf->get('seo')->completeSeoEvent($sObject);
    }

    public function hookEventValidated(HookEvent $event)
    {
        $vObject = $event->getParam('vObject');

        // Adding extra security to make sure only one eventPrice per Category is default price
        $eventPriceCategories = $vObject->getEventPriceCategories();
        foreach ($eventPriceCategories as $eventPriceCategory) {
            $hasDefault = false;
            foreach ($eventPriceCategory as $eventPrice) {
                if ($eventPrice->getDefaultPrice()) {
                    if ($hasDefault) {
                        throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, 'Un seul tarif peut être défini comme tarif par défaut pour chaque catégorie.');
                    }
                }
            }
        }

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
