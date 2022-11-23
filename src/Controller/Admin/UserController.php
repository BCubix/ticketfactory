<?php

namespace App\Controller\Admin;

use App\Entity\User\User;
use App\Form\Admin\User\UserType;
use App\Form\Admin\Filters\FilterUserType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class UserController extends CrudController
{
    protected const ENTITY_CLASS = User::class;
    protected const TYPE_CLASS = UserType::class;

    protected const NOT_FOUND_MESSAGE = "Cet utilisateur n'existe pas.";

    #[Rest\Get('/users')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/users/{userId}', requirements: ['userId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $userId): View
    {
        return parent::getOne($request, $userId);
    }

    #[Rest\Post('/users')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/users/{userId}', requirements: ['userId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $userId): View
    {
        return parent::edit($request, $userId);
    }

    #[Rest\Delete('/users/{userId}', requirements: ['userId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $userId): View
    {
        return parent::delete($request, $userId);
    }
}
