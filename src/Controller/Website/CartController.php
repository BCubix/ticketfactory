<?php

namespace App\Controller\Website;

use App\Entity\ContactRequest\ContactRequest;
use App\Form\Website\ContactRequest\ContactRequestType;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

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
}
