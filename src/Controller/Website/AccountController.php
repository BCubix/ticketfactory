<?php

namespace App\Controller\Website;

use App\Entity\Customer\Customer;
use App\Form\Website\Customer\CustomerProfileType;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AccountController extends WebsiteController
{
    #[Route('/mon-compte', name: 'tf_website_account', priority: 1)]
    public function account(Request $request): Response
    {
        $page = $this->mf->get('page')->getByKeyword('account');
        $customer = $this->getUser();

        $profileForm = $this->createForm(CustomerProfileType::class, $customer);
        $profileForm->handleRequest($request);

        if ($profileForm->isSubmitted() && $profileForm->isValid()) {
            $customer = $this->em->getRepository(Customer::class)->findOneByEmail($customer->getEmail());
            if (null === $customer) {
                $this->mf->get("customer")->upgradePassword($customer);
                $this->em->persist($customer);
                $this->em->flush();

                $this->addFlash('Succès',  "Votre profil a bien été mis à jour.");
            } else {
                $this->addFlash('Erreur',  "Un compte avec cette adresse email existe déjà.");
            }
        }

        return $this->websiteRender('Account/account.html.twig', [
            'page'        => $page,
            'customer'    => $customer,
            'profileForm' => $profileForm->createView()
        ]);
    }

    #[Route('/mon-compte/commandes', name: 'tf_website_orders', priority: 1)]
    public function orders(): Response
    {
        $page = $this->mf->get('page')->getByKeyword('orders');
        $customer = $this->getUser();

        $orders = $this->getUser()->getOrders();

        return $this->websiteRender('Account/orders.html.twig', [
            'page'     => $page,
            'customer' => $customer,
            'orders'   => $orders
        ]);
    }

    #[Route('/mon-compte/avantages', name: 'tf_website_vouchers', priority: 1)]
    public function vouchers(): Response
    {
        $page = $this->mf->get('page')->getByKeyword('vouchers');

        return $this->websiteRender('Account/vouchers.html.twig', [
            'page'     => $page
        ]);
    }
}
