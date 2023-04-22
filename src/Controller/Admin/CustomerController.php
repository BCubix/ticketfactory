<?php

namespace App\Controller\Admin;

use App\Entity\Customer\Customer;
use App\Form\Admin\Customer\CustomerType;
use App\Form\Admin\Filters\FilterCustomerType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class CustomerController extends CrudController
{
    protected const ENTITY_CLASS = Customer::class;
    protected const TYPE_CLASS = CustomerType::class;

    protected const NOT_FOUND_MESSAGE = "Ce client n'existe pas.";

    #[Rest\Get('/customers')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/customers/{customerId}', requirements: ['customerId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_one'])]
    public function getOne(Request $request, int $customerId): View
    {
        return parent::getOne($request, $customerId);
    }

    #[Rest\Post('/customers')]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/customers/{customerId}', requirements: ['customerId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_one'])]
    public function edit(Request $request, int $customerId): View
    {
        return parent::edit($request, $customerId);
    }

    #[Rest\Delete('/customers/{customerId}', requirements: ['customerId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_customer_one'])]
    public function delete(Request $request, int $customerId): View
    {
        return parent::delete($request, $customerId);
    }
}
