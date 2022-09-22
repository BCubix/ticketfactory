<?php

namespace App\Controller\Admin;

use App\Entity\ContentType\ContentType;
use App\Form\Admin\ContentType\ContentTypeType;
use App\Form\Admin\Filters\FilterContentTypeType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ContentTypeController extends CrudController
{
    protected const ENTITY_CLASS = ContentType::class;
    protected const TYPE_CLASS = ContentTypeType::class;

    protected const NOT_FOUND_MESSAGE = "Ce type de contenu n'existe pas.";

    #[Rest\Get('/content-types')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/content-types/{contentTypeId}', requirements: ['contentTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $contentTypeId): View
    {
        return parent::getOne($request, $contentTypeId);
    }

    #[Rest\Post('/content-types')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/content-types/{contentTypeId}', requirements: ['contentTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $contentTypeId): View
    {
        return parent::edit($request, $contentTypeId);
    }

    #[Rest\Delete('/content-types/{contentTypeId}', requirements: ['contentTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $contentTypeId): View
    {
        return parent::delete($request, $contentTypeId);
    }
}
