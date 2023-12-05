<?php

namespace App\Hook;

use App\Entity\Feature\FeatureValue;
use App\Event\HookEvent;
use App\Service\Addon\Hook;

class EventHook extends Hook
{
    public function hookEventSaved(HookEvent $event)
    {
        $iObject = $event->getParam('iObject');
        $sObject = $event->getParam('sObject');

        //$this->mf->get('versionnedEntity')->checkVersionnedEntity($sObject, $iObject);
    }

    public function hookEventValidated(HookEvent $event)
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
            }
        }
    }
}
