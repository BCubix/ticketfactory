<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Media\Media;

use Doctrine\ORM\EntityManagerInterface;
use Oneup\UploaderBundle\Event\PostPersistEvent;
use Oneup\UploaderBundle\UploadEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;

class FileUploader implements EventSubscriberInterface
{
    private const NOT_FOUND_MESSAGE = "Cet élément n'existe pas.";

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
