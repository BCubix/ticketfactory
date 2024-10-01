<?php

namespace App\Controller\Admin;

use App\Entity\Test\Test;
use App\Form\Test\TestType;
use FOS\RestBundle\View\View;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use FOS\RestBundle\Request\ParamFetcher;

use FOS\RestBundle\Controller\Annotations as Rest;

#[Rest\Route('/api')]
class TestController extends CrudController
{

    protected const ENTITY_CLASS = Test::class;
    protected const TYPE_CLASS = TestType::class;

    protected const NOT_FOUND_MESSAGE = "Ce feedback n'existe pas.";

    #[Rest\Get('/test')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_test_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Post('/test')]
    #[Rest\View(serializerGroups: ['a_all', 'a_test_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }
}
