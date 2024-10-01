<?php

namespace App\Controller\Admin;

use App\Entity\User\Profile;
use App\Form\Admin\Profile\ProfileType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class ProfileController extends CrudController
{
    protected const ENTITY_CLASS = Profile::class;
    protected const TYPE_CLASS = ProfileType::class;

    protected const NOT_FOUND_MESSAGE = "Ce profile n'existe pas.";
    protected const FORM_ERROR_MESSAGE = "Il y a des erreurs dans le formulaire.";

    #[Rest\Get('/profiles')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_profile_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/profiles/{profileId}', requirements: ['profileId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_profile_one'])]
    public function getOne(Request $request, int $profileId): View
    {
        return parent::getOne($request, $profileId);
    }

    #[Rest\Post('/profiles')]
    #[Rest\View(serializerGroups: ['a_all', 'a_profile_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/profiles/{profileId}', requirements: ['profileId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_profile_one'])]
    public function edit(Request $request, int $profileId): View
    {
        return parent::edit($request, $profileId);
    }

    #[Rest\Delete('/profiles/{profileId}', requirements: ['profileId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_profile_one'])]
    public function delete(Request $request, int $profileId): View
    {
        return parent::delete($request, $profileId);
    }
}
