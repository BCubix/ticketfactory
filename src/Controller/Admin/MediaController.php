<?php

namespace App\Controller\Admin;

use App\Entity\Media;
use App\Form\Admin\MediaType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class MediaController extends CrudController
{
    protected const ENTITY_CLASS = Media::class;
    protected const TYPE_CLASS = MediaType::class;

    #[Rest\Get('/medias')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/medias/{mediaId}', requirements: ['mediaId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $mediaId): View
    {
        return parent::getOne($request, $mediaId);
    }

    #[Rest\Post('/medias')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/medias/{mediaId}', requirements: ['mediaId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $mediaId): View
    {
        return parent::edit($request, $mediaId);
    }

    #[Rest\Delete('/medias/{mediaId}', requirements: ['mediaId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $mediaId): View
    {
        return parent::delete($request, $mediaId);
    }
}