<?php

namespace App\Controller\Admin;

use App\Entity\Order\Order;
use App\Exception\ApiException;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class OrderController extends CrudController
{
    protected const ENTITY_CLASS = Order::class;

    protected const NOT_FOUND_MESSAGE = "Cette commande n'existe pas.";

    #[Rest\Get('/orders')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/orders/{orderId}', requirements: ['orderId' => '\d+'])]
    #[IsGranted('ROLE_ORDER_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_order_one'])]
    public function getOne(Request $request, int $orderId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getOne($request, $orderId);
    }

    #[Rest\Get('/orders/exports')]
    #[IsGranted('ROLE_ORDER_READ')]
    public function exportOrders(Request $request)
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_purchase')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        $spreadsheet = $this->mf->get("order")->getOrdersSpreadsheet();

        $response = new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.ms-excel');
        $response->headers->set('Content-Disposition', 'attachment;filename="orders.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }
}
