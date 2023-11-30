<?php

namespace App\Controller\Admin;

use App\Entity\Product\Product;
use App\Form\Admin\Product\ProductType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

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
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/products/{productId}', requirements: ['productId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function getOne(Request $request, int $productId): View
    {
        return parent::getOne($request, $productId);
    }

    #[Rest\Post('/products')]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/products/{productId}', requirements: ['productId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function edit(Request $request, int $productId): View
    {
        return parent::edit($request, $productId);
    }

    #[Rest\Post('/products/{productId}/duplicate', requirements: ['productId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function duplicate(Request $request, int $productId): View
    {
        return parent::duplicate($request, $productId);
    }

    #[Rest\Delete('/products/{productId}', requirements: ['productId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function delete(Request $request, int $productId): View
    {
        return parent::delete($request, $productId);
    }

    #[Rest\Get('/products/{productId}/translated/{languageId}', requirements: ['productId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_product_one'])]
    public function getTranslated(Request $request, int $productId, int $languageId): View
    {
        return parent::getTranslated($request, $productId, $languageId);
    }
}
