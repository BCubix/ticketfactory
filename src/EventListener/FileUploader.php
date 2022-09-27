<?php

namespace App\EventListener;

use Doctrine\ORM\EntityManagerInterface;
use Oneup\UploaderBundle\Event\PostPersistEvent;
use Symfony\Component\HttpFoundation\Response;

use App\Entity\Media;

class FileUploader
{
    private const NOT_FOUND_MESSAGE = "Cet élément n'existe pas.";

    private $annotation;
    private $em;
    private $handler;
    private $rootPath;

    public function __construct($handler, $annotation, $rootPath, EntityManagerInterface $em)
    {
        $this->annotation = $annotation;
        $this->em = $em;
        $this->handler = $handler;
        $this->rootPath = $rootPath;
    }

    public function onUpload(PostPersistEvent $event)
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
}