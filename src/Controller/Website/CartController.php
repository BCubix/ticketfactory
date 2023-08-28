<?php

namespace App\Controller\Website;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CartController extends WebsiteController
{
    #[Route("/panier", name: "tf_website_cart", priority: 1)]
    public function index()
    {
        $reservedEvents = $this->mf->get("cart")->getCartForFront();

        return $this->websiteRender('Cart/index.html.twig', [
            "cart" => $reservedEvents
        ]);
    }

    #[Route("/panier/ajouter-une-place", name: "tf_website_cart_add_quantity", priority: 1)]
    public function addQuantity()
    {
        return $this->changeQuantity(1);
    }

    #[Route("/panier/retirer-une-place", name: "tf_website_cart_remove_quantity", priority: 1)]
    public function removeQuantity()
    {
        return $this->changeQuantity(-1);
    }

    #[Route("/panier/supprimer", name: "tf_website_cart_remove_item", priority: 1)]
    public function removeItem()
    {
        $event = $this->getRequest()->get('event');
        $eventDate = $this->getRequest()->get('eventDate');
        $eventPrice = $this->getRequest()->get('eventPrice');

        $element = [
            "event"      =>  (int) ($event ?? null),
            "eventDate"  => (int) ($eventDate ?? null),
            "eventPrice" => (int) ($eventPrice ?? null),
        ];

        $this->mf->get("cart")->deleteItem($element);

        return new Response(null, 200);
    }

    private function changeQuantity(int $quantityChange)
    {
        $event = $this->getRequest()->get('event');
        $eventDate = $this->getRequest()->get('eventDate');
        $eventPrice = $this->getRequest()->get('eventPrice');

        $element = [
            "event"      =>  (int) ($event ?? null),
            "eventDate"  => (int) ($eventDate ?? null),
            "eventPrice" => (int) ($eventPrice ?? null),
        ];

        $newElement = $this->mf->get("cart")->updateQuantity($element, $quantityChange);

        $response = new JsonResponse();
        $response->setData($newElement);
        return $response;
    }
}
