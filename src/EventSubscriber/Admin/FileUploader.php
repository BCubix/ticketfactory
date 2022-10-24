<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Media\Media;
use App\Entity\Parameter\Parameter;

use Doctrine\ORM\EntityManagerInterface;
use Oneup\UploaderBundle\Event\PostPersistEvent;
use Oneup\UploaderBundle\UploadEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;

class FileUploader implements EventSubscriberInterface
{
    private const NOT_FOUND_MESSAGE = "Cet élément n'existe pas.";
    private const BAD_REQUEST_MESSAGE = "Ce type d'upload n'est pas pris en charge.";

    private const MEDIA_ROUTE = '_uploader_upload_media';
    private const PARAMETER_ROUTE = '_uploader_upload_parameter';

    private $em;
    private $rootPath;

    public function __construct(EntityManagerInterface $em, string $rootPath)
    {
        $this->em = $em;
        $this->rootPath = $rootPath;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            UploadEvents::POST_PERSIST => [['onUpload', 0]]
        ];
    }

    public function onUpload(PostPersistEvent $event)
    {
        $route = $event->getRequest()->get("_route");

        if ($route === self::MEDIA_ROUTE) {
            return $this->mediaUpload($event);
        } else if ($route === self::PARAMETER_ROUTE) {
            return $this->parameterUpload($event);
        }

        throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, self::BAD_REQUEST_MESSAGE);

    }

    public function mediaUpload(PostPersistEvent $event)
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        $file = $event->getFile();

        $id = $event->getRequest()->get('id');
        $fileName = $event->getRequest()->get('fileName');
        $type = $event->getRequest()->get('type');
        $url = $event->getRequest()->get('filePath') . '/' . $file->getFileName();

        if (null === $id) {
            $media = new Media();

            $media->setTitle($fileName);
        } else {
            $media = $this->em->getRepository(Media::class)->findOneForAdmin($id);

            if (null === $media) {
                throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
            }
        }

        $media->setDocumentFileName($file->getFileName());
        $media->setDocumentType($type);
        $media->setDocumentSize($file->getSize());
        $media->setDocumentUrl($url);

        $this->em->persist($media);
        $this->em->flush();

        return $response;
    }

    public function parameterUpload(PostPersistEvent $event)
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        return $response;
    }
}
