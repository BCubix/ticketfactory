<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Customer\Customer;
use App\Entity\Order\Order;
use App\Entity\Order\OrderStatus;
use App\Form\Website\Customer\CustomerType;
use App\Form\Website\Customer\CustomerAddressType;
use App\Form\Website\Customer\AddressType;

use Symfony\Component\HttpFoundation\JsonResponse;
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
    public function orderConnexion (Request $request, AuthenticationUtils $authenticationUtils)
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

        return $this->websiteRender('Connection/index.html.twig', [
            'page'               => $page,
            'signupForm'         => $signupForm->createView(),
            'last_username'      => $lastUsername,
            'login_error'        => $error,
            'signinPath'         => $this->generateUrl('tf_website_order_login'),
            'orderStep'          => 1,
        ]);
    }

    #[Route("/commande/adresse", name: "tf_website_order_address", priority: 1)]
    public function orderAddress (Request $request)
    {
        $customer = $this->getUser();
        $page = $this->mf->get('page')->getByKeyword("order-address");
        $cart = $this->mf->get("cart")->getCart();

        if (null === $customer) {
            return $this->redirectToRoute("tf_website_order_connection");
        }

        if (null === $cart) {
            $this->addFlash('Erreur',  "Vous n'avez pas de panier.");

            return $this->redirectToRoute('tf_website_cart');
        }

        $addressForm = $this->createForm(AddressType::class, $customer->getAddress());
        $addressForm->handleRequest($request);

        if ($addressForm->isSubmitted() && $addressForm->isValid()) {
            $this->em->persist($customer);
            $this->em->flush();

            return $this->redirectToRoute("tf_website_order_payment");
        }

        return $this->websiteRender('Order/address.html.twig', [
            'page'        => $page,
            'addressForm' => $addressForm->createView(),
            'orderStep'   => 2
        ]);
    }

    #[Route("/commande/paiement", name: "tf_website_order_payment", priority: 1)]
    public function orderPayment(Request $request)
    {
        $page = $this->mf->get("page")->getByKeyword('order-payment');

        return $this->websiteRender("Order/payment.html.twig", [
            'page'      => $page,
            'orderStep' => 3,
        ]);
    }

    #[Route("/commande/commande-validee", name: "tf_website_order_validated", priority: 1)]
    public function orderValidated(Request $request)
    {
        $page = $this->mf->get("page")->getByKeyword('order-validated');

        $cart = $this->mf->get("cart")->getCart();
        if (null === $cart) {
            $this->addFlash('Erreur',  "Vous n'avez pas de panier.");

            return $this->redirectToRoute('tf_website_cart');
        }

        $status = $this->em->getRepository(OrderStatus::class)->findOneByKeywordForWebsite("waiting");
        if (null === $status) {
            $this->addFlash('Erreur',  "Une erreur est survenue.");

            return $this->redirectToRoute('tf_website_cart');
        }

        $customer = $this->getUser();
        if (null === $customer) {
            $this->addFlash('Erreur',  "Une erreur est survenue.");

            return $this->redirectToRoute('tf_website_cart');
        }

        $order = $this->mf->get('order')->createNewOrder($customer, $status, $cart);

        $this->em->flush();

        return $this->websiteRender("Order/validated.html.twig", [
            'page'      => $page,
            'orderStep' => 3,
        ]);
    }
}
