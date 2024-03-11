<?php

namespace App\Controller\Admin;

use App\Entity\Ticketing\Ticketing;
use App\Form\Admin\Feature\FeatureType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class TicketingController extends CrudController
{
    protected const ENTITY_CLASS = Ticketing::class;
    protected const TYPE_CLASS = FeatureType::class;

    protected const NOT_FOUND_MESSAGE = "Cette billetterie n'existe pas.";

    #[Rest\Get('/ticketing')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/ticketing/{ticketingId}', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function getOne(Request $request, int $ticketingId): View
    {
        return parent::getOne($request, $ticketingId);
    }

    #[Rest\Post('/ticketing')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/ticketing/{ticketingId}', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function edit(Request $request, int $ticketingId): View
    {
        return parent::edit($request, $ticketingId);
    }

    #[Rest\Delete('/ticketing/{ticketingId}', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function delete(Request $request, int $ticketingId): View
    {
        return parent::delete($request, $ticketingId);
    }
}
