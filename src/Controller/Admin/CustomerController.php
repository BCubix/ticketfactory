<?php

namespace App\Controller\Admin;

use App\Entity\Customer\Customer;
use App\Exception\ApiException;
use App\Form\Admin\Customer\CustomerType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class CustomerController extends CrudController
{
    protected const ENTITY_CLASS = Customer::class;
    protected const TYPE_CLASS = CustomerType::class;

    protected const NOT_FOUND_MESSAGE = "Ce client n'existe pas.";

    #[Rest\Get('/customers')]
    #[IsGranted('ROLE_CUSTOMER_READ')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_customers')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/customers/{customerId}', requirements: ['customerId' => '\d+'])]
    #[IsGranted('ROLE_CUSTOMER_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_one'])]
    public function getOne(Request $request, int $customerId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_customers')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::getOne($request, $customerId);
    }

    #[Rest\Post('/customers')]
    #[IsGranted('ROLE_CUSTOMER_CREATE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_one'])]
    public function add(Request $request): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_customers')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::add($request);
    }

    #[Rest\Post('/customers/{customerId}', requirements: ['customerId' => '\d+'])]
    #[IsGranted('ROLE_CUSTOMER_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_one'])]
    public function edit(Request $request, int $customerId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_customers')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::edit($request, $customerId);
    }

    #[Rest\Delete('/customers/{customerId}', requirements: ['customerId' => '\d+'])]
    #[IsGranted('ROLE_CUSTOMER_DELETE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_one'])]
    public function delete(Request $request, int $customerId): View
    {
        if (!$this->mf->get("parameter")->getCoreParameter('use_customers')) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_PAGE);
        }

        return parent::delete($request, $customerId);
    }
}
