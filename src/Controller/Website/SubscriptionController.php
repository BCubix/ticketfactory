<?php

namespace App\Controller\Website;

use App\Entity\Page\Page;
use App\Entity\Subscription\Subscription;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SubscriptionController extends WebsiteController
{
    public function index(Page $page)
    {
        $subscriptions = $this->mf->get('subscription')->getSubscriptionsForWebsite();
        $breadcrumbs = $this->mf->get('page')->generatePageBreadCrumbs($page);

        return $this->websiteRender('Subscription/index.html.twig', [
            "breadcrumbs"   => $breadcrumbs,
            "page"          => $page,
            'subscriptions' => $subscriptions
        ]);
    }

    #[Route("/subscriptions/add-subscription-to-cart", name: "tf_website_cart_add_subscription", priority: 1)]
    public function addSubscription()
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase') || $this->mf->get("parameter")->getCoreParameter('catalog_mode')) {
            return new Response(null, 404);
        }

        $quantity = $this->getRequest()->get('quantity') ?? 1;
        $subscriptionId = $this->getRequest()->get('subscriptionId');
        if (null === $subscriptionId) {
            return new Response(null, 400);
        }

        $subscription = $this->em->getRepository(Subscription::class)->findOneForWebsite($subscriptionId);
        if (null === $subscription) {
            return new Response(null, 404);
        }

        $this->mf->get('cart')->addSubscriptionToCart($subscription, $quantity);

        return $this->websiteRender("_partials/_notification.html.twig", [
            'title' => 'Succès',
            'message' => "Votre abonnement à été ajouté au panier."
        ]);
    }
}