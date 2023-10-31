<?php

namespace App\Manager;

use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;

use Symfony\Component\HttpFoundation\File\File;

class MediaManager extends AbstractManager
{
    public const SERVICE_NAME = 'media';

    public function getFilePathFromDocumentUrl(Media $media): string
    {
        return $this->sf->get('pathGetter')->getPublicDir() . $media->getDocumentUrl();
    }

    public function checkFormatMedia(Media $media, ImageFormat $imageFormat): bool
    {
        foreach ($media->getImageFormats() as $format) {
            if ($format->getId() === $imageFormat->getId()) {
                return true;
            }
        }

        return false;
    }

    public function checkFileFromPath(string $path): bool
    {
        if (file_exists($this->sf->get('pathGetter')->getPublicDir() . $path)) {
            return true;
        }

        return false;
    }

    public function getFilePathFromFormat(File $mediaFile, Imageformat $format): ?string
    {
        $filePath = $mediaFile->getPath();

        $fileName = $mediaFile->getFilename();
        $fileNameArr = explode('.', $fileName);

        $extension = $fileNameArr[count($fileNameArr) - 1];
        unset($fileNameArr[count($fileNameArr) - 1]);

        return $filePath . '/' . implode('.', $fileNameArr) . '-' . $format->getSlug() . '.' . $extension;
    }

    public function getFormattedMediaPathFromFormat(Media $media, Imageformat $format): ?string
    {
        $filePath = substr($media->getDocumentUrl(), 0, strrpos($media->getDocumentUrl(), '/'));

        $fileName = $media->getDocumentFileName();
        $fileNameArr = explode('.', $fileName);
        unset($fileNameArr[count($fileNameArr) - 1]);

        $formattedExtension = $this->mf->get('parameter')->getCoreParameter('image_format');
        $extension = '';

        switch ($formattedExtension) {
            case IMAGETYPE_WEBP:
                $extension = ".webp";
                break;
            case IMAGETYPE_PNG:
                $extension = ".png";
                break;
            case IMAGETYPE_JPEG:
            default:
                $extension = ".jpg";
                break;
        }

        return $filePath . '/' . implode('.', $fileNameArr) . '-' . $format->getSlug() . $extension;
    }

    public function getFormattedImage(Media $media, ?string $keyword): ?Media
    {
        $imageFormat = $this->em->getRepository(ImageFormat::class)->findOneBySlugForWebsite($keyword);

        if (null === $imageFormat) {
            return null;
        }

        $filePath = $this->getFormattedMediaPathFromFormat($media, $imageFormat);

        if (!$this->checkFileFromPath($filePath)) {
            return null;
        }

        $media->setDocumentUrl($filePath);

        return $media;
    }

    public function getFormattedImageUrlFromFormat(Media $media, ?ImageFormat $imageFormat): ?string
    {
        if (null === $imageFormat || !$this->checkFormatMedia($media, $imageFormat)) {
            return null;
        }

        $filePath = $this->getFormattedMediaPathFromFormat($media, $imageFormat);

        if (!$this->checkFileFromPath($filePath)) {
            return null;
        }

        return $filePath;
    }

    public function getFirstFormattedMedia(mixed $medias, string $keyword): ?Media
    {
        $imageFormat = $this->em->getRepository(ImageFormat::class)->findOneBySlugForWebsite($keyword);

        if (null === $imageFormat) {
            return null;
        }

        foreach ($medias as $media) {
            if ($media->getRealType() === 'image') {
                foreach ($media->getImageFormats() as $format) {
                    if ($format->getId() === $imageFormat->getId()) {
                        $filePath = $this->getFormattedMediaPathFromFormat($media, $imageFormat);
                        if ($this->checkFileFromPath($filePath)) {
                            $media->setDocumentUrl($filePath);
                            return $media;
                        }
                    }
                }
            }
        }

        return null;
    }
}
