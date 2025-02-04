<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CartController extends WebsiteController
{
    public function index(Page $page)
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);
        $cart = $this->mf->get("cart")->getCart();
        $subscriptionDiscount = $this->mf->get("subscription")->findSubscriptionForCart($cart);
        $vouchers = $this->mf->get("cart")->getVouchers($cart);
        $discount = $this->mf->get("cart")->calculateDiscount($cart);

        $this->mf->get("cart")->checkForOldCart();

        return $this->websiteRender('Cart/index.html.twig', [
            "breadcrumbs" => $breadcrumbs,
            "cart" => $cart,
            "discount" => $discount,
            "vouchers" => $vouchers,
            "subscriptionDiscount" => $subscriptionDiscount
        ]);
    }

    #[Route("/cart/change-quantity", name: "tf_website_cart_change_quantity", priority: 1)]
    public function addQuantity()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $request = $this->getRequest();
        $quantity = null !== $request->get('quantity') ? intval($request->get('quantity')) : null;
        $eventRowId = $request->get("eventRowId");
        $eventPriceId = $request->get("eventPriceId");
        $productRowId = $request->get("productRowId");
        $subscriptionRowId = $request->get('subscriptionRowId');

        if (null !== $quantity && null !== $eventRowId && null !== $eventPriceId) {
            $this->mf->get("cart")->updateQuantity(["eventRowId" => $eventRowId, "eventPriceId" => $eventPriceId], $quantity);
        } else if (null !== $quantity && null !== $productRowId) {
            $this->mf->get("cart")->updateProductQuantity(["productRowId" => $productRowId], $quantity);
        } else if (null !== $quantity && null !== $subscriptionRowId) {
            $this->mf->get('cart')->updateSubscriptionQuantity(['subscriptionRowId' => $subscriptionRowId], $quantity);
        }

        $cart = $this->mf->get("cart")->getCart();
        $vouchers = $this->mf->get("cart")->getVouchers($cart);
        $discount = $this->mf->get("cart")->calculateDiscount($cart);
        $subscriptionDiscount = $this->mf->get("subscription")->findSubscriptionForCart($cart);

        return $this->websiteRender('Cart/_index.html.twig', [
            "cart" => $cart,
            "discount" => $discount,
            "vouchers" => $vouchers,
            "subscriptionDiscount" => $subscriptionDiscount
        ]);
    }

    #[Route("/cart/delete", name: "tf_website_cart_remove", priority: 1)]
    public function removeRow()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $request = $this->getRequest();
        $eventRowId = $request->get('eventRowId');
        $productRowId = $request->get('productRowId');
        $subscriptionRowId = $request->get('subscriptionRowId');

        if (null !== $eventRowId) {
            $this->mf->get("cart")->deleteEventRow($eventRowId);
        } else if (null !== $productRowId) {
            $this->mf->get("cart")->deleteProductRow($productRowId);
        } else if (null !== $subscriptionRowId) {
            $this->mf->get("cart")->deleteSubscriptionRow($subscriptionRowId);
        }

        $cart = $this->mf->get("cart")->getCart();
        $vouchers = $this->mf->get("cart")->getVouchers($cart);
        $discount = $this->mf->get("cart")->calculateDiscount($cart);
        $subscriptionDiscount = $this->mf->get("subscription")->findSubscriptionForCart($cart);

        return $this->websiteRender('Cart/_index.html.twig', [
            "cart" => $cart,
            "discount" => $discount,
            "vouchers" => $vouchers,
            "subscriptionDiscount" => $subscriptionDiscount
        ]);
    }

    #[Route("/cart/delete-seats", name: "tf_website_cart_remove_seats", priority: 1)]
    public function removeSeats()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $eventRowId = $this->getRequest()->get('eventRowId');
        $eventPriceId = $this->getRequest()->get('eventPriceId');

        $this->mf->get("cart")->deleteEventSeats(['eventRowId' => $eventRowId, 'eventPriceId' => $eventPriceId]);

        $cart = $this->mf->get("cart")->getCart();
        $vouchers = $this->mf->get("cart")->getVouchers($cart);
        $discount = $this->mf->get("cart")->calculateDiscount($cart);
        $subscriptionDiscount = $this->mf->get("subscription")->findSubscriptionForCart($cart);

        return $this->websiteRender('Cart/_index.html.twig', [
            "cart" => $cart,
            "discount" => $discount,
            "vouchers" => $vouchers,
            "subscriptionDiscount" => $subscriptionDiscount
        ]);
    }

    #[Route("/cart/add-voucher", name: "tf_website_cart_add_voucher", priority: 1)]
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
            $vouchers = $this->mf->get("cart")->getVouchers($cart);
            $discount = $this->mf->get("cart")->calculateDiscount($cart);
            $subscriptionDiscount = $this->mf->get("subscription")->findSubscriptionForCart($cart);

            return $this->websiteRender('Cart/_index.html.twig', [
                "cart" => $cart,
                "discount" => $discount,
                "vouchers" => $vouchers,
                "subscriptionDiscount" => $subscriptionDiscount
            ]);
        }

        return new Response(null, 200);
    }
}
