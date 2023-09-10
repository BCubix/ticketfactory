<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Customer\Customer;
use App\Form\Website\Customer\CustomerType;

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
        $cart = $this->mf->get("cart")->getCart();

        if (null === $customer) {
            return $this->redirectToRoute("tf_website_order_connection");
        }

        if (null === $cart) {
            $this->addFlash('Erreur',  "Vous n'avez pas de panier.");

            return $this->redirectToRoute('tf_website_cart');
        }

        dd("Ok");
    }
}
