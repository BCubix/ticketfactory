<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Media\Media;
use App\Entity\Media\ImageFormat;
use App\Entity\Module\Module;
use App\Entity\Parameter\Parameter;

use App\Exception\ApiException;
use App\Service\Module\ModuleService;
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

    private const MEDIA_FILE_PATH = "/public/uploads/media/";

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
        } else if ($route === self::MODULE_ROUTE) {
            return $this->moduleUpload($event);
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

    public function moduleUpload(PostPersistEvent $event)
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        $moduleDirPath = $this->rootPath.'/modules/';
        $zipPath = $moduleDirPath.$response["filename"];

        $zip = new \ZipArchive;

        if (!$zip->open($zipPath) || !$zip->extractTo($moduleDirPath)) {
            unlink($zipPath);
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, self::BAD_REQUEST_MESSAGE);
        }

        unlink($zipPath);

        $modulePath = $moduleDirPath.$zip->getNameIndex(0);

        // Zip can't be empty and have to contain main directory in architecture
        if ($zip->numFiles === 0 || !is_dir($modulePath)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, self::BAD_REQUEST_MESSAGE);
        }

        // Get the first dir name
        $name = trim($zip->getNameIndex(0), '/');

        // Check if a logo is present in module
        $logo = is_file($modulePath.'logo.jpg') || is_file($modulePath.'logo.png');

        $zip->close();

        $module = $this->em->getRepository(Module::class)->findOneByName($name) ?? new Module();
        $module->setActive(true);
        $module->setName($name);
        $module->setLogo($logo);

        $this->em->persist($module);
        $this->em->flush();

        ModuleService::callConfig($name, 'install');

        shell_exec('php ../bin/console cache:clear');
        shell_exec('php ../bin/console doctrine:schema:update --force');

        return $response;
    }
}
