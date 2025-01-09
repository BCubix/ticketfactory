<?php

namespace App\Controller\Admin;

use App\Entity\Order\OrderStatus;
use App\Form\Admin\Order\OrderStatusType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class OrderStatusController extends CrudController
{
    protected const ENTITY_CLASS = OrderStatus::class;
    protected const TYPE_CLASS = OrderStatusType::class;

    protected const NOT_FOUND_MESSAGE = "Cette étape n'existe pas.";

    #[Rest\Get('/order-status')]
    #[IsGranted('ROLE_ORDER_STATUS_READ')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_status_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/order-status/{orderStatusId}', requirements: ['orderStatusId' => '\d+'])]
    #[IsGranted('ROLE_ORDER_STATUS_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_status_one'])]
    public function getOne(Request $request, int $orderStatusId): View
    {
        return parent::getOne($request, $orderStatusId);
    }

    #[Rest\Post('/order-status/{orderStatusId}', requirements: ['orderStatusId' => '\d+'])]
    #[IsGranted('ROLE_ORDER_STATUS_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_status_one'])]
    public function edit(Request $request, int $orderStatusId): View
    {
        return parent::edit($request, $orderStatusId);
    }
}
