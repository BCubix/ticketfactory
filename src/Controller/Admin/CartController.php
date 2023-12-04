<?php

namespace App\Controller\Admin;

use App\Entity\Order\Cart;
use App\Exception\ApiException;
use App\Form\Admin\Order\CartType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class CartController extends CrudController
{
    protected const ENTITY_CLASS = Cart::class;
    protected const TYPE_CLASS = CartType::class;

    protected const NOT_FOUND_MESSAGE = "Ce panier n'existe pas.";

    #[Rest\Get('/carts')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_cart_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/carts/{cartId}', requirements: ['cartId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_cart_one'])]
    public function getOne(Request $request, int $cartId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getOne($request, $cartId);
    }

    #[Rest\Post('/carts')]
    #[Rest\View(serializerGroups: ['a_all', 'a_cart_one'])]
    public function add(Request $request): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::add($request);
    }

    #[Rest\Post('/carts/{cartId}', requirements: ['cartId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_cart_one'])]
    public function edit(Request $request, int $cartId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::edit($request, $cartId);
    }

    #[Rest\Delete('/carts/{cartId}', requirements: ['cartId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_cart_one'])]
    public function delete(Request $request, int $cartId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::delete($request, $cartId);
    }
}
