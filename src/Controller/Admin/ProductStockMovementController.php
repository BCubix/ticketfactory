<?php

namespace App\Controller\Admin;

use App\Entity\Product\ProductStockMovement;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class ProductStockMovementController extends AdminController
{
    #[Rest\Get('/productStockMovement/{productId}', requirements: ['productId' => '\d+'])]
    #[IsGranted('ROLE_PRODUCT_READ')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_product_one', 'a_order_all', 'a_product_stock_movement_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher,  int $productId): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;

        $movements = $this->em->getRepository(ProductStockMovement::class)->findAllForProduct($productId);

        return $this->view($movements, Response::HTTP_OK);
    }
}
