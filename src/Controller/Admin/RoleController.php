<?php

namespace App\Controller\Admin;

use App\Entity\User\Role;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class RoleController extends CrudController
{
    protected const ENTITY_CLASS = Role::class;

    protected const NOT_FOUND_MESSAGE = "Ce role n'existe pas.";

    #[Rest\Get('/roles')]
    #[Rest\QueryParam(name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_role_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;

        $roles = $this->mf->get("role")->getRoles($filters);

        return $this->view($roles, Response::HTTP_OK);
    }
}
