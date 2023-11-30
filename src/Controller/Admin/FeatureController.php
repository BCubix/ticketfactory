<?php

namespace App\Controller\Admin;

use App\Entity\Feature\Feature;
use App\Form\Admin\Feature\FeatureType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class FeatureController extends CrudController
{
    protected const ENTITY_CLASS = Feature::class;
    protected const TYPE_CLASS = FeatureType::class;

    protected const NOT_FOUND_MESSAGE = "Cet attribut n'existe pas.";

    #[Rest\Get('/features')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/features/{featureId}', requirements: ['featureId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function getOne(Request $request, int $featureId): View
    {
        return parent::getOne($request, $featureId);
    }

    #[Rest\Post('/features')]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/features/{featureId}', requirements: ['featureId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function edit(Request $request, int $featureId): View
    {
        return parent::edit($request, $featureId);
    }

    #[Rest\Delete('/features/{featureId}', requirements: ['featureId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_feature_category_one'])]
    public function delete(Request $request, int $featureId): View
    {
        return parent::delete($request, $featureId);
    }
}
