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

    public function getFilePathFromFormat(File $mediaFile, Imageformat $format): ?string
    {
        $filePath = $mediaFile->getPath();

        $fileName = $mediaFile->getFilename();
        $fileNameArr = explode('.', $fileName);

        $extension = $fileNameArr[count($fileNameArr) - 1];
        unset($fileNameArr[count($fileNameArr) - 1]);

        return $filePath . implode('.', $fileNameArr) . '-' . $format->getSlug() . '.' . $extension;
    }
}
