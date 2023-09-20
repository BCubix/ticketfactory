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
        $discount = $this->mf->get("cart")->calculateDiscount($cart);

        return $this->websiteRender('Cart/index.html.twig', [
            "cart" => $cart,
            'discount' => $discount,
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
        $cartRowId = $this->getRequest()->get('cartRowId');
        $eventPriceId = $this->getRequest()->get('eventPriceId');

        $cartRow = $this->mf->get("cart")->deleteCartSeats(['cartRowId' => $cartRowId, 'eventPriceId' => $eventPriceId]);

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
        $request = $this->getRequest();

        $cartRowId = $request->get("cartRowId");
        $eventPriceId = $request->get("eventPriceId");

        if (null !== $cartRowId && null !== $eventPriceId) {
            $cartRow = $this->mf->get("cart")->updateQuantity(["cartRowId" => $cartRowId, "eventPriceId" => $eventPriceId], $quantityChange);
        }

        $cart = $this->mf->get("cart")->getCart();
        $discount = $this->mf->get("cart")->calculateDiscount($cart);

        return $this->websiteRender('Cart/_index.html.twig', [
            "cart" => $cart,
            'discount' => $discount,
        ]);
    }
}
