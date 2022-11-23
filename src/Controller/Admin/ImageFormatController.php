<?php

namespace App\Controller\Admin;

use App\Entity\Media\ImageFormat;
use App\Form\Admin\Media\ImageFormatType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class ImageFormatController extends CrudController
{
    protected const ENTITY_CLASS = ImageFormat::class;
    protected const TYPE_CLASS = ImageFormatType::class;

    #[Rest\Get('/image-formats')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/image-formats/{formatId}', requirements: ['formatId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $formatId): View
    {
        return parent::getOne($request, $formatId);
    }

    #[Rest\Post('/image-formats')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/image-formats/{formatId}', requirements: ['formatId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $formatId): View
    {
        return parent::edit($request, $formatId);
    }

    #[Rest\Delete('/image-formats/{formatId}', requirements: ['formatId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $formatId): View
    {
        return parent::delete($request, $formatId);
    }
}
