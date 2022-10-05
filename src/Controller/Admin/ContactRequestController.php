<?php

namespace App\Controller\Admin;

use App\Entity\ContactRequest\ContactRequest;
use App\Form\Admin\ContactRequest\ContactRequestType;
use App\Form\Admin\Filters\FilterContactRequestType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ContactRequestController extends CrudController
{
    protected const ENTITY_CLASS = ContactRequest::class;
    protected const TYPE_CLASS = ContactRequestType::class;

    protected const NOT_FOUND_MESSAGE = "Cette demande de contact n'existe pas.";

    #[Rest\Get('/contact-requests')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/contact-requests/{requestId}', requirements: ['requestId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $requestId): View
    {
        return parent::getOne($request, $requestId);
    }

    #[Rest\Post('/contact-requests')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/contact-requests/{requestId}', requirements: ['requestId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $requestId): View
    {
        return parent::edit($request, $requestId);
    }

    #[Rest\Delete('/contact-requests/{requestId}', requirements: ['requestId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $requestId): View
    {
        return parent::delete($request, $requestId);
    }
}
