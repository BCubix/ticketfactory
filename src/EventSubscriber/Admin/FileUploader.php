<?php

namespace App\EventSubscriber\Admin;

use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;
use App\Entity\Addon\Module;
use App\Entity\Parameter\Parameter;
use App\Exception\ApiException;
use App\Manager\ImageFormatManager;
use App\Manager\ModuleManager;
use App\Manager\ThemeManager;
use App\Manager\HookManager;
use App\Manager\ManagerFactory;
use App\Service\File\MimeTypeMapping;


use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Oneup\UploaderBundle\Event\PostPersistEvent;
use Oneup\UploaderBundle\Event\PostUploadEvent;
use Oneup\UploaderBundle\Uploader\Response\ResponseInterface;
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
    private $mm;
    private $tm;
    private $hm;
    private $ifm;
    private $se;
    private $mf;

    public function __construct(EntityManagerInterface $em, string $rootPath, ModuleManager $mm, ThemeManager $tm, HookManager $hm, ManagerFactory $mf, ImageFormatManager $ifm, SerializerInterface $se)
    {
        $this->em = $em;
        $this->rootPath = $rootPath;
        $this->mm = $mm;
        $this->tm = $tm;
        $this->hm = $hm;
        $this->ifm = $ifm;
        $this->se = $se;
        $this->mf = $mf;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            UploadEvents::POST_PERSIST => [['onUpload', 0]],
        ];
    }

    public function onUpload(PostPersistEvent $event): ?ResponseInterface
    {
        $route = $event->getRequest()->get("_route");
        $response = $event->getResponse();

        if (!isset($response['handled']) || $response['handled'] === false) {
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
        return ($response);
    }

    public function mediaUpload(PostPersistEvent $event): ResponseInterface
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
        $typeCheck = MimeTypeMapping::getTypeFromMime($type);

        $formats = [];
        if ($typeCheck === "Image") {
            $imageFormParameters = $this->mf->get('parameter')->getCoreParameter('default_image_formats');

            if ($imageFormParameters !== null) {
                $tmpStringImageForm = str_replace(' ', '', $imageFormParameters);
                $imageFormatIdArray = explode(",", $tmpStringImageForm);
                $formats = $this->em->getRepository(ImageFormat::class)->findImageFormatById($imageFormatIdArray);
            }
            foreach ($formats["results"] as $format) {
                $media->addImageFormat($format);
            }
        }

        $this->em->persist($media);
        $this->em->flush();

        $this->moveFile($media, $event->getRequest()->get('filePath') . "/");
        if ($typeCheck === "Image") {
            $this->hm->exec('MediaSaved', [
                'sObject' => $media,
                'state' => 'add',
                'formats' => $formats
            ]);
        } else {
            $this->hm->exec('MediaSaved', [
                'sObject' => $media,
                'state' => 'add'
            ]);
        }

        $context = SerializationContext::create()->setGroups(['a_edit']);
        $response["media"] = $this->se->serialize($media, 'json', $context);
        return $response;
    }

    public function parameterUpload(PostPersistEvent $event): ResponseInterface
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        return $response;
    }

    public function moduleUpload(PostPersistEvent $event): ResponseInterface
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        $names = $this->mm->unzip($response["filename"]);

        foreach ($names['module'] as $name) {
            $this->mm->active($name, Module::ACTION_INSTALL);
        }

        return $response;
    }

    public function themeUpload(PostPersistEvent $event): ResponseInterface
    {
        $response = $event->getResponse();
        $response['success'] = true;
        $response["filename"] = $event->getFile()->getFilename();

        $names = $this->tm->unzip($response["filename"]);

        foreach ($names['module'] as $name) {
            $this->mm->active($name, Module::ACTION_INSTALL);
        }

        foreach ($names['theme'] as $name) {
            $this->mm->active($name, Module::ACTION_INSTALL);
        }

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

        $media->setDocumentUrl($basePath . $folderDestination . $media->getDocumentFileName());

        $this->em->persist($media);
        $this->em->flush();
    }

    private function getFolderByElementId(int $id): string
    {
        $stringId = (string) $id;
        $path = "";

        foreach (str_split($stringId) as $charParsedId) {
            $path = $path . $charParsedId . "/";
        }

        return $path;
    }
}
