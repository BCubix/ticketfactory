<?php

namespace App\Manager;

use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;
use App\Utils\MimeTypeMapping;
use App\Utils\PathGetter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\RequestStack;

class MediaManager extends AbstractManager
{
    protected $pg;

    public function __construct(
        ManagerFactory $mf,
        EntityManagerInterface $em,
        RequestStack $rs,
        PathGetter $pg
    ) {
        parent::__construct($mf, $em, $rs);

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
