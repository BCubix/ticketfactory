<?php

namespace App\Manager;

use App\Entity\Order\Cart;
use App\Entity\Order\DeliveryMode;

class DeliveryModeManager extends AbstractManager
{
    public const SERVICE_NAME = 'deliveryMode';

    public function setCartDeliveryMode(Cart $cart): void
    {
        $deliveryModes = $this->em->getRepository(DeliveryMode::class)->findAllForWebsite();
        if (count($deliveryModes) == 0) {
            $cart->setDeliveryPrice(null);

            $this->em->persist($cart);
        }

        if (null === $cart->getDeliveryMode()) {
            $cart->setDeliveryMode($deliveryModes[0]);
        }

        $this->mf->get($cart->getDeliveryMode()->getManager())->calculateDeliveryPrice($cart);
    }
}