<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;
use App\Exception\ApiException;
use App\Manager\ModuleManager;
use App\Manager\ThemeManager;
use App\Service\ModuleTheme\Service\ModuleService;
use App\Service\ModuleTheme\Service\ThemeService;

use Doctrine\ORM\EntityManagerInterface;
use Oneup\UploaderBundle\Event\PostPersistEvent;
use Oneup\UploaderBundle\UploadEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

class FileUploader implements EventSubscriberInterface
{
    private const NOT_FOUND_MESSAGE = "Cet élément n'existe pas.";
    private const BAD_REQUEST_MESSAGE = "Ce type d'upload n'est pas pris en charge.";

    private const MEDIA_ROUTE = '_uploader_upload_media';
    private const PARAMETER_ROUTE = '_uploader_upload_parameter';
    private const MODULE_ROUTE = '_uploader_upload_module';
    private const THEME_ROUTE = '_uploader_upload_theme';

    private const MEDIA_FILE_PATH = "/public/uploads/media/";

    private $em;
    private $rootPath;
    private $ms;
    private $ts;
    private $mm;
    private $tm;

    public function __construct(EntityManagerInterface $em, string $rootPath, ModuleService $ms, ThemeService $ts, ModuleManager $mm, ThemeManager $tm)
    {
        $this->em = $em;
        $this->rootPath = $rootPath;
        $this->ms = $ms;
        $this->ts = $ts;
        $this->mm = $mm;
        $this->tm = $tm;
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
        } else if ($route === self::MODULE_ROUTE) {
            return $this->moduleUpload($event);
        } else if ($route === self::THEME_ROUTE) {
            return $this->themeUpload($event);
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

        $this->moveFile($media, $event->getRequest()->get('filePath') . "/");

        return $response;
    }

    public function parameterUpload(PostPersistEvent $event)
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        return $response;
    }

    public function moduleUpload(PostPersistEvent $event)
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        $name = $this->ms->unzip($response["filename"]);
        $this->mm->createNewModule($name);

        return $response;
    }

    public function themeUpload(PostPersistEvent $event)
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        $name = $this->ts->unzip($response["filename"]);
        $this->tm->createNewTheme($name);

        return $response;
    }

    private function moveFile(Media $media, string $basePath): void
    {
        $filePath = $this->rootPath . self::MEDIA_FILE_PATH . $media->getDocumentFileName();
        if (!file_exists($filePath)) {
            return;
        }

        $documentFile = new UploadedFile($filePath, $media->getDocumentFileName(), null, null, true);
        $folderDestination = $this->getFolderByElementId($media->getId());
        $documentFile->move($this->rootPath . self::MEDIA_FILE_PATH . $folderDestination);

        $media->setDocumentUrl($basePath . $folderDestination . "/" . $media->getDocumentFileName());

        $this->em->persist($media);
        $this->em->flush();
    }

    private function getFolderByElementId(int $id): string
    {
        $stringId = (string) $id;
        $path = "";

        foreach(str_split($stringId) as $charParsedId) {
            $path = $path . $charParsedId . "/";
        }

        return $path;
    }

    private function createMediaThumbnails(Media $media)
    {
        $imageFormat = $this->em->getRepository(ImageFormat::class)->findAllForAdmin([ "page" => 0]);
        if (null === $imageFormat) {
            return;
        }

        $imageFormat = $imageFormat["result"];

        foreach($imageFormat as $format) {

        }
    }
}
