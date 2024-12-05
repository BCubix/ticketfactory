<?php

namespace App\Controller\Website;

use App\Entity\Customer\Address;
use App\Entity\Customer\Customer;
use App\Entity\Order\SubscriptionRow;
use App\Entity\Order\Voucher;
use App\Form\Website\Customer\CustomerAddressType;
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
        $customerBase = clone $customer;

        $profileForm = $this->createForm(CustomerProfileType::class, $customer);
        $profileForm->handleRequest($request);

        if ($profileForm->isSubmitted() && $profileForm->isValid()) {
            $customer = $this->em->getRepository(Customer::class)->findOneByEmail($customer->getEmail());
            if (null === $customer || $customerBase->getEmail() === $customer->getEmail()) {
                $this->mf->get("customer")->upgradePassword($customer);

                $this->em->persist($customer);
                $this->em->flush();

                $this->addFlash('Succès',  "Votre profil a bien été mis à jour.");
            } else {
                $this->addFlash('Erreur',  "Un compte avec cette adresse email existe déjà.");
            }
        }

        $address = $customer->getAddress();
        if (null === $address) {
            $address = new Address();
            $address->setCustomer($customer);
        }

        $addressForm = $this->createForm(CustomerAddressType::class, $address);
        $addressForm->handleRequest($request);
        if ($addressForm->isSubmitted() && $addressForm->isValid()) {
            try {
                $this->em->persist($address);
                $this->em->flush();

                $this->addFlash('Succès',  "Votre profil a bien été mis à jour.");
            } catch (\Exception $e) {
                $this->addFlash('Erreur',  "Une erreur est survenue.");
            }
        }

        return $this->websiteRender('Account/account.html.twig', [
            'page'        => $page,
            'customer'    => $customer,
            'profileForm' => $profileForm->createView(),
            'addressForm' => $addressForm->createView(),
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

    #[Route('/mon-compte/abonnements', name: 'tf_website_subscriptions', priority: 1)]
    public function subscriptions(): Response
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_subscriptions') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $page = $this->mf->get('page')->getByKeyword('subscriptions');
        $customer = $this->getUser();

        $subscriptionRows = $this->em->getRepository(SubscriptionRow::class)->findAllSubscriptionRowsByCustomerForWebsite($customer->getId());

        return $this->websiteRender('Account/subscriptions.html.twig', [
            'page'            => $page,
            'customer'        => $customer,
            'subscriptionRows'   => $subscriptionRows
        ]);
    }

    #[Route('/mon-compte/avantages', name: 'tf_website_vouchers', priority: 1)]
    public function vouchers(): Response
    {
        $page = $this->mf->get('page')->getByKeyword('vouchers');
        $customer = $this->getUser();

        $vouchers = $this->em->getRepository(Voucher::class)->findVouchersByCustomerForWebsite($customer->getId());

        return $this->websiteRender('Account/vouchers.html.twig', [
            'page'     => $page,
            'vouchers' => $vouchers,
        ]);
    }
}
