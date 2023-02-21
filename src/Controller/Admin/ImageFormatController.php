<?php

namespace App\Controller\Admin;

use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;
use App\Exception\ApiException;
use App\Form\Admin\Media\ImageFormatType;
use App\Manager\ImageFormatManager;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ImageFormatController extends CrudController
{
    protected const ENTITY_CLASS = ImageFormat::class;
    protected const TYPE_CLASS = ImageFormatType::class;

    #[Rest\Get('/image-formats')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_image_format_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/image-formats/{formatId}', requirements: ['formatId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_image_format_one'])]
    public function getOne(Request $request, int $formatId): View
    {
        return parent::getOne($request, $formatId);
    }

    #[Rest\Post('/image-formats')]
    #[Rest\View(serializerGroups: ['a_all', 'a_image_format_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/image-formats/{formatId}', requirements: ['formatId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_image_format_one'])]
    public function edit(Request $request, int $formatId): View
    {
        return parent::edit($request, $formatId);
    }

    #[Rest\Delete('/image-formats/{formatId}', requirements: ['formatId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_image_format_one'])]
    public function delete(Request $request, int $formatId): View
    {
        return parent::delete($request, $formatId);
    }

    #[Rest\Post('/image-formats/generate/{formatId}', requirements: ['formatId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_image_format_one'])]
    public function generate(Request $request, ImageFormatManager $ifm, int $formatId = null): View
    {
        if (null === $formatId) {
            $formats = $this->em->getRepository(ImageFormat::class)->findAllForAdmin(['page' => 0]);
        } else {
            $format = $this->em->getRepository(ImageFormat::class)->findOneForAdmin($formatId);
            if (null === $format) {
                throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
            }

            $formats = [ 'results' => [ $format ] ];
        }

        $medias = $this->em->getRepository(Media::class)->findAllForAdmin(['page' => 0]);
        $mediasChunks = array_chunk($medias['results'], 10);

        $chunkMediaIndex = $request->get('chunkMediaIndex');
        if ($chunkMediaIndex >= count($mediasChunks)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400,
                "La position pour la liste de chunk des medias par 10 est incorrecte.");
        }

        $medias = $mediasChunks[intval($chunkMediaIndex)];

        $deleteOldThumbnailsStr = $request->get('deleteOldThumbnails');
        $deleteOldThumbnails = $deleteOldThumbnailsStr === "1";
        if ($deleteOldThumbnails) {
            $ifm->deleteThumbnails($formats, $medias);
        }

        $ifm->generateThumbnails($formats, $medias);

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }
}
