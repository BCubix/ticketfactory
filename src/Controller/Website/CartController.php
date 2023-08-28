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
        $cart = $this->mf->get("cart")->getCart();

        return $this->websiteRender('Cart/index.html.twig', [
            "cart" => $cart
        ]);
    }

    #[Route("/panier/ajouter-une-place", name: "tf_website_cart_increase_quantity", priority: 1)]
    public function addQuantity()
    {
        return $this->changeQuantity(1);
    }

    #[Route("/panier/retirer-une-place", name: "tf_website_cart_decrease_quantity", priority: 1)]
    public function removeQuantity()
    {
        return $this->changeQuantity(-1);
    }

    #[Route("/panier/supprimer", name: "tf_website_cart_remove_row", priority: 1)]
    public function removeRow()
    {
        $cartRowId = $this->getRequest()->get('cartRowId'); 

        $this->mf->get("cart")->deleteCartRow($cartRowId);

        return new Response(null, 200);
    }

    #[Route("/panier/supprimer-des-places", name: "tf_website_cart_remove_seats", priority: 1)]
    public function removeSeats()
    {
        $cartRowId = $this->getRequest()->get('cartRowId');
        $eventPriceId = $this->getRequest()->get('eventPriceId');

        $cartRow = $this->mf->get("cart")->deleteCartSeats(['cartRowId' => $cartRowId, 'eventPriceId' => $eventPriceId]);
        if (null === $cartRow) {
            return new Response(null, 200);
        }

        return $this->websiteRender('Cart/_cartRow.html.twig', [
            "cartRow" => $cartRow,
        ]);
    }

    private function changeQuantity(int $quantityChange)
    {
        $request = $this->getRequest();

        $cartRowId = $request->get("cartRowId");
        $eventPriceId = $request->get("eventPriceId");

        $cartRow = $this->mf->get("cart")->updateQuantity(["cartRowId" => $cartRowId, "eventPriceId" => $eventPriceId], $quantityChange);

        if (count($cartRow->getCartSeats()) === 0) {
            return new Response(null, 200);
        }

        return $this->websiteRender('Cart/_cartRow.html.twig', [
            "cartRow" => $cartRow,
        ]);
    }
}
