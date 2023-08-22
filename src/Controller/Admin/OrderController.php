<?php

namespace App\Controller\Admin;

use App\Entity\Order\Order;
use App\Form\Admin\Order\OrderType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class OrderController extends CrudController
{
    protected const ENTITY_CLASS = Order::class;
    protected const TYPE_CLASS = OrderType::class;

    protected const NOT_FOUND_MESSAGE = "Cette commande n'existe pas.";

    #[Rest\Get('/orders')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/orders/{orderId}', requirements: ['orderId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_one'])]
    public function getOne(Request $request, int $orderId): View
    {
        return parent::getOne($request, $orderId);
    }

    #[Rest\Post('/orders')]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/orders/{orderId}', requirements: ['orderId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_one'])]
    public function edit(Request $request, int $orderId): View
    {
        return parent::edit($request, $orderId);
    }

    #[Rest\Delete('/orders/{orderId}', requirements: ['orderId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_one'])]
    public function delete(Request $request, int $orderId): View
    {
        return parent::delete($request, $orderId);
    }
}
