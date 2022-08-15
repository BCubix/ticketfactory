<?php

namespace App\EventListener;

use Doctrine\ORM\EntityManagerInterface;
use Oneup\UploaderBundle\Event\PostPersistEvent;

use App\Entity\Media;

class FileUploader
{
    private $em;

    private $handler;
    private $annotation;
    
    private $rootPath;

    public function __construct($handler, $annotation, $rootPath, EntityManagerInterface $em)
    {
        $this->handler = $handler;
        $this->annotation = $annotation;

        $this->rootPath = $rootPath;

        $this->em = $em;
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

        if ($id == null) {
            $media = new Media();

            $media->setTitle($fileName);
            $media->setDocumentFileName($file->getFileName());
            $media->setDocumentType($type);
            $media->setDocumentSize($file->getSize());
            $media->setDocumentUrl($url);

            $this->em->persist($media);
            $this->em->flush();
        }

        return $response;
    }
}