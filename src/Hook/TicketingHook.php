<?php

namespace App\Hook;

use App\Entity\Event\Event;
use App\Entity\Product\Product;
use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;
use Symfony\Component\HttpFoundation\Response;

class TicketingHook extends Hook
{
    public function hookTicketingInstantiated(HookEvent $event)
    {
        $state = $event->getParam('state');
        if ($state !== 'delete') {
            return;
        }

        $object = $event->getParam('object');
        if ($object->isDefaultTicketing()) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Vous ne pouvez pas supprimer la billetterie par défaut.");
        }

        $events = $this->em->getRepository(Event::class)->findEventByTicketingForAdmin($object->getId());
        $products = $this->em->getRepository(Product::class)->findProductByTicketingForAdmin($object->getId());

        foreach ($events as $event) {
            $event->setTicketing(null);
            $this->em->persist($event);
        }

        foreach ($products as $product) {
            $product->setTicketing(null);
            $this->em->persist($product);
        }

        $this->em->flush();
    }
}
