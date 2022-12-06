<?php

namespace App\Manager;

use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;
use App\Utils\PathGetter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\File;

class MediaManager extends AbstractManager
{
    private $pg;

    public function __construct(EntityManagerInterface $em, PathGetter $pg)
    {
        parent::__construct($em);

        $this->pg = $pg;
    }

    public function getFilePathFromDocumentUrl(Media $media): string
    {
        return $this->pg->getPublicDir() . $media->getDocumentUrl();
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
