<?php

namespace App\Controller\Admin;

use App\Entity\Order\Voucher;
use App\Form\Admin\Order\VoucherType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class VoucherController extends CrudController
{
    protected const ENTITY_CLASS = Voucher::class;
    protected const TYPE_CLASS = VoucherType::class;

    protected const NOT_FOUND_MESSAGE = "Cette salle n'existe pas.";

    #[Rest\Get('/vouchers')]
    #[Rest\QueryParam(name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_voucher_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/vouchers/{voucherId}', requirements: ['voucherId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_voucher_one'])]
    public function getOne(Request $request, int $voucherId): View
    {
        return parent::getOne($request, $voucherId);
    }

    #[Rest\Post('/vouchers')]
    #[Rest\View(serializerGroups: ['a_all', 'a_voucher_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/vouchers/{voucherId}', requirements: ['voucherId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_voucher_one'])]
    public function edit(Request $request, int $voucherId): View
    {
        return parent::edit($request, $voucherId);
    }

    #[Rest\Post('/vouchers/{voucherId}/duplicate', requirements: ['voucherId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_voucher_one'])]
    public function duplicate(Request $request, int $voucherId): View
    {
        return parent::duplicate($request, $voucherId);
    }

    #[Rest\Delete('/vouchers/{voucherId}', requirements: ['voucherId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_voucher_one'])]
    public function delete(Request $request, int $voucherId): View
    {
        return parent::delete($request, $voucherId);
    }

    #[Rest\Get('/vouchers/{voucherId}/translated/{languageId}', requirements: ['voucherId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_voucher_one'])]
    public function getTranslated(Request $request, int $voucherId, int $languageId): View
    {
        return parent::getTranslated($request, $voucherId, $languageId);
    }
}
