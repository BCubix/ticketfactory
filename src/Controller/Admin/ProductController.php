<?php

namespace App\Controller\Admin;

use App\Entity\Product\Product;
use App\Exception\ApiException;
use App\Form\Admin\Product\ProductType;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class ProductController extends CrudController
{
    protected const ENTITY_CLASS = Product::class;
    protected const TYPE_CLASS = ProductType::class;

    protected const NOT_FOUND_MESSAGE = "Ce produit n'existe pas.";

    #[Rest\Get('/products')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_products')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/products/{productId}', requirements: ['productId' => '\d+'])]
    #[IsGranted('ROLE_PRODUCT_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function getOne(Request $request, int $productId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_products')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getOne($request, $productId);
    }

    #[Rest\Post('/products')]
    #[IsGranted('ROLE_PRODUCT_CREATE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function add(Request $request): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_products')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::add($request);
    }

    #[Rest\Post('/products/{productId}', requirements: ['productId' => '\d+'])]
    #[IsGranted('ROLE_PRODUCT_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function edit(Request $request, int $productId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_products')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::edit($request, $productId);
    }

    #[Rest\Post('/products/{productId}/duplicate', requirements: ['productId' => '\d+'])]
    #[IsGranted('ROLE_PRODUCT_CREATE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function duplicate(Request $request, int $productId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_products')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::duplicate($request, $productId);
    }

    #[Rest\Delete('/products/{productId}', requirements: ['productId' => '\d+'])]
    #[IsGranted('ROLE_PRODUCT_DELETE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function delete(Request $request, int $productId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_products')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::delete($request, $productId);
    }

    #[Rest\Get('/products/{productId}/translated/{languageId}', requirements: ['productId' => '\d+', 'languageId' => '\d+'])]
    #[IsGranted('ROLE_PRODUCT_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function getTranslated(Request $request, int $productId, int $languageId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_products')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getTranslated($request, $productId, $languageId);
    }
}
