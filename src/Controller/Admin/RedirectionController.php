<?php

namespace App\Controller\Admin;

use App\Entity\Technical\Redirection;
use App\Form\Admin\Technical\RedirectionType;
use App\Form\Admin\Filters\FilterRedirectionType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class RedirectionController extends CrudController
{
    protected const ENTITY_CLASS = Redirection::class;
    protected const TYPE_CLASS = RedirectionType::class;

    protected const NOT_FOUND_MESSAGE = "Cette redirection n'existe pas.";

    #[Rest\Get('/redirections')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/redirections/{redirectionId}', requirements: ['redirectionId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $redirectionId): View
    {
        return parent::getOne($request, $redirectionId);
    }

    #[Rest\Post('/redirections')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/redirections/{redirectionId}', requirements: ['redirectionId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $redirectionId): View
    {
        return parent::edit($request, $redirectionId);
    }

    #[Rest\Delete('/redirections/{redirectionId}', requirements: ['redirectionId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $redirectionId): View
    {
        return parent::delete($request, $redirectionId);
    }
}
