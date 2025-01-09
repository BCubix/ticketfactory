<?php

namespace App\Controller\Admin;

use App\Entity\Feature\FeatureCategory;
use App\Form\Admin\Feature\FeatureCategoryType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class FeatureCategoryController extends CrudController
{
    protected const ENTITY_CLASS = FeatureCategory::class;
    protected const TYPE_CLASS = FeatureCategoryType::class;

    protected const NOT_FOUND_MESSAGE = "Cette catégorie n'existe pas.";

    #[Rest\Get('/features-categories')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/features-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[IsGranted('ROLE_FEATURE_CATEGORY_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function getOne(Request $request, int $categoryId): View
    {
        return parent::getOne($request, $categoryId);
    }

    #[Rest\Post('/features-categories')]
    #[IsGranted('ROLE_FEATURE_CATEGORY_CREATE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/features-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[IsGranted('ROLE_FEATURE_CATEGORY_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function edit(Request $request, int $categoryId): View
    {
        return parent::edit($request, $categoryId);
    }

    #[Rest\Post('/features-categories/{categoryId}/duplicate', requirements: ['categoryId' => '\d+'])]
    #[IsGranted('ROLE_FEATURE_CATEGORY_CREATE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function duplicate(Request $request, int $categoryId): View
    {
        return parent::duplicate($request, $categoryId);
    }

    #[Rest\Delete('/features-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[IsGranted('ROLE_FEATURE_CATEGORY_DELETE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function delete(Request $request, int $categoryId): View
    {
        return parent::delete($request, $categoryId);
    }

    #[Rest\Get('/features-categories/{categoryId}/translated/{languageId}', requirements: ['categoryId' => '\d+', 'languageId' => '\d+'])]
    #[IsGranted('ROLE_FEATURE_CATEGORY_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function getTranslated(Request $request, int $categoryId, int $languageId): View
    {
        return parent::getTranslated($request, $categoryId, $languageId);
    }
}
