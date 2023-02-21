<?php

namespace App\Controller\Admin;

use App\Entity\Language\Language;
use App\Form\Admin\Language\LanguageType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class LanguageController extends CrudController
{
    protected const ENTITY_CLASS = Language::class;
    protected const TYPE_CLASS = LanguageType::class;

    protected const NOT_FOUND_MESSAGE = "Cette langue n'existe pas.";

    #[Rest\Get('/languages')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_language_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/languages/{languageId}', requirements: ['languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_language_one'])]
    public function getOne(Request $request, int $languageId): View
    {
        return parent::getOne($request, $languageId);
    }

    #[Rest\Post('/languages')]
    #[Rest\View(serializerGroups: ['a_all', 'a_language_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/languages/{languageId}', requirements: ['languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_language_one'])]
    public function edit(Request $request, int $languageId): View
    {
        return parent::edit($request, $languageId);
    }

    #[Rest\Delete('/languages/{languageId}', requirements: ['languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_language_one'])]
    public function delete(Request $request, int $languageId): View
    {
        return parent::delete($request, $languageId);
    }
}
