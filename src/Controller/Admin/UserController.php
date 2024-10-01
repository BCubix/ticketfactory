<?php

namespace App\Controller\Admin;

use App\Entity\User\User;
use App\Exception\ApiException;
use App\Form\Admin\User\UserType;
use App\Form\Admin\User\UserProfileType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class UserController extends CrudController
{
    protected const ENTITY_CLASS = User::class;
    protected const TYPE_CLASS = UserType::class;

    protected const NOT_FOUND_MESSAGE = "Cet utilisateur n'existe pas.";

    #[Rest\Get('/users')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_user_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/users/{userId}', requirements: ['userId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_user_one'])]
    public function getOne(Request $request, int $userId): View
    {
        return parent::getOne($request, $userId);
    }

    #[Rest\Get('/user-profile')]
    #[Rest\View(serializerGroups: ['a_all', 'a_user_one'])]
    public function getUserProfile(Request $request): View
    {
        $user = $this->getUser();

        return $this->view($user, Response::HTTP_OK);
    }


    #[Rest\Post('/users')]
    #[Rest\View(serializerGroups: ['a_all', 'a_user_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/users/{userId}', requirements: ['userId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_user_one'])]
    public function edit(Request $request, int $userId): View
    {
        return parent::edit($request, $userId);
    }

    #[Rest\Post('/user-profile')]
    #[Rest\View(serializerGroups: ['a_all', 'a_user_one'])]
    public function editUserProfile(Request $request): View
    {
        $user = $this->getUser();

        $form = $this->createForm(UserProfileType::class, $user);
        $fields = array_replace_recursive($request->request->all(), $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);

            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, self::FORM_ERROR_MESSAGE, $errors);
        }

        $this->em->persist($user);
        $this->em->flush();

        $this->log->log(0, 0, 'Updated object.', User::class, $user->getId());

        return $this->view($user, Response::HTTP_OK);
    }

    #[Rest\Delete('/users/{userId}', requirements: ['userId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_user_one'])]
    public function delete(Request $request, int $userId): View
    {
        return parent::delete($request, $userId);
    }
}
