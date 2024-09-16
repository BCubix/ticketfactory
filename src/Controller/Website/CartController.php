<?php

namespace App\Controller\Website;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CartController extends WebsiteController
{
    #[Route("/panier", name: "tf_website_cart", priority: 1)]
    public function index()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $cart = $this->mf->get("cart")->getCart();
        $discount = $this->mf->get("cart")->calculateDiscount($cart);

        return $this->websiteRender('Cart/index.html.twig', [
            "cart" => $cart,
            'discount' => $discount,
        ]);
    }

    #[Route("/panier/ajouter-une-place", name: "tf_website_cart_increase_quantity", priority: 1)]
    public function addQuantity()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        return $this->changeQuantity(1);
    }

    #[Route("/panier/retirer-une-place", name: "tf_website_cart_decrease_quantity", priority: 1)]
    public function removeQuantity()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        return $this->changeQuantity(-1);
    }

    #[Route("/panier/supprimer", name: "tf_website_cart_remove_row", priority: 1)]
    public function removeRow()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $eventRowId = $this->getRequest()->get('eventRowId');

        $this->mf->get("cart")->deleteEventRow($eventRowId);

        $cart = $this->mf->get("cart")->getCart();
        $discount = $this->mf->get("cart")->calculateDiscount($cart);

        return $this->websiteRender('Cart/_index.html.twig', [
            "cart" => $cart,
            'discount' => $discount,
        ]);
    }

    #[Route("/panier/supprimer-des-places", name: "tf_website_cart_remove_seats", priority: 1)]
    public function removeSeats()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $eventRowId = $this->getRequest()->get('eventRowId');
        $eventPriceId = $this->getRequest()->get('eventPriceId');

        $eventRow = $this->mf->get("cart")->deleteEventSeats(['eventRowId' => $eventRowId, 'eventPriceId' => $eventPriceId]);

        $cart = $this->mf->get("cart")->getCart();
        $discount = $this->mf->get("cart")->calculateDiscount($cart);

        return $this->websiteRender('Cart/_index.html.twig', [
            "cart" => $cart,
            'discount' => $discount,
        ]);
    }

    #[Route("/panier/ajouter-un-code", name: "tf_website_cart_add_voucher", priority: 1)]
    public function addVoucher()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $cart = $this->mf->get("cart")->getCart();
        $code = $this->getRequest()->get('code');


        if (null !== $cart && null !== $code) {
            $this->mf->get("cart")->addVoucher($cart, $code);

            $cart = $this->mf->get("cart")->getCart();
            $discount = $this->mf->get("cart")->calculateDiscount($cart);

            return $this->websiteRender('Cart/_index.html.twig', [
                "cart" => $cart,
                'discount' => $discount,
            ]);
        }

        return new Response(null, 200);
    }

    private function changeQuantity(int $quantityChange)
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $request = $this->getRequest();

        $eventRowId = $request->get("eventRowId");
        $eventPriceId = $request->get("eventPriceId");

        if (null !== $eventRowId && null !== $eventPriceId) {
            $this->mf->get("cart")->updateQuantity(["eventRowId" => $eventRowId, "eventPriceId" => $eventPriceId], $quantityChange);
        }

        $cart = $this->mf->get("cart")->getCart();
        $discount = $this->mf->get("cart")->calculateDiscount($cart);

        return $this->websiteRender('Cart/_index.html.twig', [
            "cart" => $cart,
            'discount' => $discount,
        ]);
    }
}
