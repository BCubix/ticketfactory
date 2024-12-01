<?php

namespace App\Controller\Admin;

use App\Entity\Subscription\Subscription;
use App\Form\Admin\Subscription\SubscriptionType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class SubscriptionController extends CrudController
{
    protected const ENTITY_CLASS = Subscription::class;
    protected const TYPE_CLASS = SubscriptionType::class;

    protected const NOT_FOUND_MESSAGE = "Cet abonnement n'existe pas.";

    #[Rest\Get('/subscriptions')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_subscription_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/subscriptions/{subscriptionId}', requirements: ['subscriptionId' => '\d+'])]
    #[IsGranted('ROLE_SUBSCRIPTION_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_subscription_one'])]
    public function getOne(Request $request, int $subscriptionId): View
    {
        return parent::getOne($request, $subscriptionId);
    }

    #[Rest\Post('/subscriptions')]
    #[IsGranted('ROLE_SUBSCRIPTION_CREATE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_subscription_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/subscriptions/{subscriptionId}', requirements: ['subscriptionId' => '\d+'])]
    #[IsGranted('ROLE_SUBSCRIPTION_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_subscription_one'])]
    public function edit(Request $request, int $subscriptionId): View
    {
        return parent::edit($request, $subscriptionId);
    }

    #[Rest\Post('/subscriptions/{subscriptionId}/duplicate', requirements: ['subscriptionId' => '\d+'])]
    #[IsGranted('ROLE_SUBSCRIPTION_CREATE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_subscription_one'])]
    public function duplicate(Request $request, int $subscriptionId): View
    {
        return parent::duplicate($request, $subscriptionId);
    }

    #[Rest\Delete('/subscriptions/{subscriptionId}', requirements: ['subscriptionId' => '\d+'])]
    #[IsGranted('ROLE_SUBSCRIPTION_DELETE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_subscription_one'])]
    public function delete(Request $request, int $subscriptionId): View
    {
        return parent::delete($request, $subscriptionId);
    }

    #[Rest\Get('/subscriptions/{subscriptionId}/translated/{languageId}', requirements: ['subscriptionId' => '\d+', 'languageId' => '\d+'])]
    #[IsGranted('ROLE_SUBSCRIPTION_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_subscription_one'])]
    public function getTranslated(Request $request, int $subscriptionId, int $languageId): View
    {
        return parent::getTranslated($request, $subscriptionId, $languageId);
    }
}
