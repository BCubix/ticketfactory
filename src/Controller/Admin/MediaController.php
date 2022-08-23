<?php

namespace App\Controller\Admin;

use App\Entity\Media;
use App\Form\Admin\MediaType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Exception\ApiException;

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

    #[Rest\Post('/medias/{mediaId}/rotate/{rotate}', requirements: ['mediaId' => '\d+', 'rotate' => '(\+|\-)90'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function rotate(Request $request, int $mediaId, int $rotate): View
    {
        if ($rotate != 90 && $rotate != -90) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, "La valeur de rotation est incorrect");
        }

        $object = $this->em->getRepository(Media::class)->findOneForAdmin($mediaId);

        if (is_null($object)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        $projectDir = $this->getParameter('kernel.project_dir');
        $image = new \Imagick($projectDir . "/public/uploads/media/" . $object->getdocumentFileName());
        $image->rotateImage(new \ImagickPixel(), $rotate);

        $image->writeImage($projectDir . "/public/uploads/media/" . $object->getdocumentFileName());
        return $this->view($object, Response::HTTP_OK);
    }

    #[Rest\Post('/medias/{mediaId}/flip/{flip}', requirements: ['mediaId' => '\d+', 'flip' => 'vertical|horizontal'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function flip(Request $request, int $mediaId, string $flip): View
    {
        if ($flip != "vertical" && $flip != "horizontal") {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, "La valeur de retournement est incorrect");
        }

        $object = $this->em->getRepository(Media::class)->findOneForAdmin($mediaId);

        if (is_null($object)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        $projectDir = $this->getParameter('kernel.project_dir');
        $image = new \Imagick($projectDir . "/public/uploads/media/" . $object->getdocumentFileName());

        if ($flip == "vertical") {
            $image->flipImage();
        } else {
            $image->flopImage();
        }

        $image->writeImage($projectDir . "/public/uploads/media/" . $object->getdocumentFileName());
        return $this->view($object, Response::HTTP_OK);
    }


}