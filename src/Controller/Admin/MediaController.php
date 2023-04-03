<?php

namespace App\Controller\Admin;

use App\Entity\Media\Media;
use App\Exception\ApiException;
use App\Form\Admin\Media\MediaType;
use App\Service\File\MimeTypeMapping;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class MediaController extends CrudController
{
    protected const ENTITY_CLASS = Media::class;
    protected const TYPE_CLASS = MediaType::class;

    #[Rest\Get('/medias')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_media_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;

        $this->transformTypeFilter($filters);

        $objects = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters);
        $objects = $this->lm->getAllTranslations($objects, $this->entityClass, $filters);

        return $this->view($objects, Response::HTTP_OK);
    }

    #[Rest\Get('/medias/{mediaId}', requirements: ['mediaId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_media_one'])]
    public function getOne(Request $request, int $mediaId): View
    {
        return parent::getOne($request, $mediaId);
    }

    #[Rest\Post('/medias')]
    #[Rest\View(serializerGroups: ['a_all', 'a_media_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/medias/{mediaId}', requirements: ['mediaId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_media_one'])]
    public function edit(Request $request, int $mediaId): View
    {
        return parent::edit($request, $mediaId);
    }

    #[Rest\Delete('/medias/{mediaId}', requirements: ['mediaId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_media_one'])]
    public function delete(Request $request, int $mediaId): View
    {
        return parent::delete($request, $mediaId);
    }

    private function transformTypeFilter(array &$filters)
    {
        if (empty($filters['type'])) {
            return;
        }

        $types = [];
        foreach ($filters['type'] as $type) {
            $types[] = MimeTypeMapping::getMimesFromType($type);
        }

        $filters['type'] = $types;
    }
}