<?php

namespace App\Controller\Admin;

use App\Entity\User\User;
use App\Form\Admin\User\UserProfileType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProfileController extends AdminController
{
    #[Rest\Get('/profile')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request): View
    {
        $user = $this->getUser();

        return $this->view($user, Response::HTTP_OK);
    }

    #[Rest\Post('/profile')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request): View
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

        return $this->view($user, Response::HTTP_OK);
    }
}
