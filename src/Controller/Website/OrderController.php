<?php

namespace App\Controller\Website;

use App\Entity\Customer\Customer;
use App\Entity\Order\OrderStatus;
use App\Form\Website\Customer\CustomerType;
use App\Form\Website\Customer\AddressType;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class OrderController extends WebsiteController
{
    #[Route('/commande/login', name: 'tf_website_order_login', priority: 1)]
    public function login()
    {
        return $this->redirectToRoute("tf_website_order_connection");
    }

    #[Route("/commande/connexion", name: "tf_website_order_connection", priority: 1)]
    public function orderConnexion(Request $request, AuthenticationUtils $authenticationUtils)
    {
        $homeUrl = $this->sf->get('urlService')->keywordPath('home');
        $page = $this->mf->get('page')->getByKeyword('connection');

        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        $customer = new Customer();
        $customer->setActive(false);

        $signupForm = $this->createForm(CustomerType::class, $customer);
        $signupForm->handleRequest($request);

        if ($signupForm->isSubmitted() && $signupForm->isValid()) {
            $customerBase = $this->em->getRepository(Customer::class)->findOneByEmail($customer->getEmail());
            if (null === $customerBase) {
                $this->mf->get("customer")->checkEmailAddress($customer);
                $this->em->persist($customer);

                $this->mf->get("customer")->upgradePassword($customer);
                $this->em->flush();

                $this->addFlash('Succès',  "Votre inscription a bien été prise en compte. Veuillez confirmer votre adresse email.");

                return $this->redirect($homeUrl);
            }

            $this->addFlash('Erreur',  "Un compte avec cette adresse email existe déjà.");
        }

        $cart = $this->mf->get("cart")->getCart();
        $discount = $this->mf->get("cart")->calculateDiscount($cart);

        return $this->websiteRender('Connection/index.html.twig', [
            'page'               => $page,
            'signupForm'         => $signupForm->createView(),
            'last_username'      => $lastUsername,
            'login_error'        => $error,
            'signinPath'         => $this->generateUrl('tf_website_order_login'),
            'orderStep'          => 1,
            "cart"               => $cart,
            "discount"           => $discount,
        ]);
    }

    #[Route("/commande/adresse", name: "tf_website_order_address", priority: 1)]
    public function orderAddress(Request $request)
    {
        $customer = $this->getUser();
        $page = $this->mf->get('page')->getByKeyword("order-address");
        $cart = $this->mf->get("cart")->getCart();

        // We redirect to connection page if there is no customer
        if (null === $customer) {
            return $this->redirectToRoute("tf_website_order_connection");
        }

        // We redirect to cart page if there is no cart
        if (null === $cart) {
            $this->addFlash('Erreur',  "Vous n'avez pas de panier.");

            return $this->redirect($this->sf->get('urlService')->keywordPath('cart'));
        }

        // We get the address from the cart if exist or create a new one from customer address
        if (null !== $cart->getAddress()) {
            $address = $cart->getAddress();
        } else {
            $address = $this->mf->get('address')->createNewAddressObject($customer->getAddress());
            $address->setCart($cart);
        }

        // We set the delivery mode and calculate delivery price
        $this->mf->get('deliveryMode')->setCartDeliveryMode($cart);

        $this->em->persist($cart);
        $this->em->flush();

        // We create the address form with cart address
        $addressForm = $this->createForm(AddressType::class, $address);
        $addressForm->handleRequest($request);

        // We handle address form submition and save data, then redirect to payment page
        if ($addressForm->isSubmitted() && $addressForm->isValid()) {
            $this->em->persist($address);
            $this->em->flush();

            return $this->redirectToRoute("tf_website_order_payment");
        }

        $cart = $this->mf->get("cart")->getCart();
        $discount = $this->mf->get("cart")->calculateDiscount($cart);
        $subscriptionDiscount = $this->mf->get("subscription")->findSubscriptionForCart($cart);

        // We render the address template
        return $this->websiteRender('Order/address.html.twig', [
            'page'                  => $page,
            'addressForm'           => $addressForm->createView(),
            'orderStep'             => 2,
            "cart"                  => $cart,
            "discount"              => $discount,
            "subscriptionDiscount"  => $subscriptionDiscount
        ]);
    }

    #[Route("/commande/paiement", name: "tf_website_order_payment", priority: 1)]
    public function orderPayment(Request $request)
    {
        $page = $this->mf->get("page")->getByKeyword('order-payment');

        $cart = $this->mf->get("cart")->getCart();
        $discount = $this->mf->get("cart")->calculateDiscount($cart);
        $subscriptionDiscount = $this->mf->get("subscription")->findSubscriptionForCart($cart);

        return $this->websiteRender("Order/payment.html.twig", [
            'page'                  => $page,
            'orderStep'             => 3,
            "cart"                  => $cart,
            "discount"              => $discount,
            "subscriptionDiscount"  => $subscriptionDiscount
        ]);
    }

    #[Route("/commande/commande-validee", name: "tf_website_order_validated", priority: 1)]
    public function orderValidated(Request $request)
    {
        $page = $this->mf->get("page")->getByKeyword('order-validated');

        $cart = $this->mf->get("cart")->getCart();
        if (null === $cart) {
            $this->addFlash('Erreur',  "Vous n'avez pas de panier.");

            return $this->redirect($this->sf->get('urlService')->keywordPath('cart'));
        }

        $status = $this->em->getRepository(OrderStatus::class)->findOneByKeywordForWebsite("waiting");
        if (null === $status) {
            $this->addFlash('Erreur',  "Une erreur est survenue.");

            return $this->redirect($this->sf->get('urlService')->keywordPath('cart'));
        }

        $customer = $this->getUser();
        if (null === $customer) {
            $this->addFlash('Erreur',  "Une erreur est survenue.");

            return $this->redirect($this->sf->get('urlService')->keywordPath('cart'));
        }

        $order = $cart->getLinkedOrder();
        if (null === $order) {
            $order = $this->mf->get('order')->createNewOrder($customer, $status, $cart);

            $this->mf->get('hook')->exec("actionOrderCreated", [
                'cObject' => $order,
            ]);
        }

        // call to the validatedOrder hook
        $this->mf->get('hook')->exec('OrderCompleted', [
            'cart' => $cart,
        ]);

        $this->mf->get('cart')->createNewCart();
        $this->em->flush();

        return $this->websiteRender("Order/validated.html.twig", [
            'page'      => $page,
            'orderStep' => 3,
        ]);
    }

    #[Route("/commande/facture/{orderId}", name: "tf_website_order_invoice", requirements: ['eventId' => '\d+'], priority: 1)]
    public function orderInvoice(Request $request, int $orderId)
    {
        // Get Customer object and check for null.
        $customer = $this->getUser();
        if (null === $customer) {
            $this->addFlash('Erreur',  "Une erreur est survenue.");

            return $this->redirect($this->sf->get('urlService')->keywordPath('cart'));
        }

        // Get Order object using OrderID and CustomerID, and check for null.
        $order = $this->mf->get("order")->getOrderForWebsite($orderId, $customer->getId());
        if (null === $order) {
            throw $this->createNotFoundException('Cette commande n\'existe pas.');
        }

        // Generate invoice PDF File from OrderManager
        $invoice = $this->mf->get("order")->getInvoiceFile($order);

        // Return the invoice file with the correct content type and name.
        return new Response($invoice, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="facture.pdf"',
        ]);
    }
}
