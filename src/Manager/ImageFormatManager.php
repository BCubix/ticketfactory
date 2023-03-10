<?php

namespace App\Manager;

use App\Entity\Media\ImageFormat;
use App\Entity\Media\Media;
use App\Manager\MediaManager;
use App\Manager\ParameterManager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

class ImageFormatManager extends AbstractManager
{
    private $pm;
    private $mm;

    public function __construct(EntityManagerInterface $em, ParameterManager $pm, MediaManager $mm)
    {
        parent::__construct($em);

        $this->pm = $pm;
        $this->mm = $mm;
    }

    public function generateThumbnails(array $formats = null, array $medias = null): bool
    {
        if (null === $formats) {
            $formats = $this->em->getRepository(ImageFormat::class)->findAllForAdmin([]);
        }

        if (null === $medias) {
            $medias = $this->em->getRepository(Media::class)->findByTypeForAdmin('Image');
        }

        $success = true;
        foreach ($medias as $media) {
            try {
                $mediaFile = new File($this->mm->getFilePathFromDocumentUrl($media), true);
            } catch (FileNotFoundException $fnfe) {
                continue;
            }

            foreach ($formats['results'] as $format) {
                $sourceFile = $mediaFile->getRealPath();
                $destinationFile = $this->mm->getFilePathFromFormat($mediaFile, $format);
                $destW = $format->getWidth();
                $destH = $format->getHeight();

                if (!$this->formatImage($sourceFile, $destinationFile, $destW, $destH)) {
                    $success = false;
                }
            }
        }

        return $success;
    }

    public function formatImage(string $sourceFile, string $destinationFile, int $canvW, int $canvH): ?bool
    {
        // Access file informations
        clearstatcache(true, $sourceFile);
        if (!file_exists($sourceFile) || !filesize($sourceFile)) {
            return null;
        }

        // Getting file informations
        list($srcType, $originW, $originH, $rotate) = $this->getImageDetails($sourceFile);
        if ($originW == 0 || $originH == 0) {
            return null;
        }

        // Define the new image extension
        $newType = $this->pm->get('image_format');
        if ($newType == 0) {
            $newType = $srcType;
        }

        // Check if image must be cropped
        $crop = $this->pm->get('image_to_crop');

        // New dimensions initialisation
        $srcX  = 0;
        $srcY  = 0;
        $srcW  = $originW;
        $srcH  = $originH;

        $destX = 0;
        $destY = 0;
        $destW = $canvW;
        $destH = $canvH;

        $diffW = $originW / $canvW;
        $diffH = $originH / $canvH;

        if ($crop) {
            if ($diffW < $diffH) {
                $srcH = floor($srcW * $destH / $destW);
            } else {
                $srcW = floor($srcH * $destW / $destH);
            }

            $srcX = ($originW / 2) - ($srcW / 2);
            $srcY = ($originH / 2) - ($srcH / 2);
        } else {
            if ($diffW > $diffH) {
                $destH = floor($srcH * $destW / $srcW);
            } else {
                $destW = floor($srcW * $destH / $srcH);
            }

            $destX = ($canvW / 2) - ($destW / 2);
            $destY = ($canvH / 2) - ($destH / 2);
        }

        // @TODO : Check memory limit


        // Creation of a new empty canvas in $destImage
        $this->createCanvas($destImage, $newType, $canvW, $canvH);

        // Get image content and rotate if needed
        $srcImage = $this->createImg($srcType, $sourceFile);
        if ($rotate) {
            $srcImage = imagerotate($srcImage, $rotate, 0);
        }

        // New image creation
        imagecopyresampled($destImage, $srcImage, $destX, $destY, $srcX, $srcY, $destW, $destH, $srcW, $srcH);

        $newFile = $this->write($newType, $destImage, $destinationFile);
        @imagedestroy($srcImage);

        return $newFile;
    }

    public function createImg(int $type, string $filename): mixed
    {
        switch ($type) {
            case IMAGETYPE_WEBP:
                return imagecreatefromwebp($filename);

            case IMAGETYPE_PNG:
                return imagecreatefrompng($filename);

            case IMAGETYPE_JPEG:
            default:
                return imagecreatefromjpeg($filename);
        }
    }

    private function getImageDetails(string $sourceFile): array
    {
        list($tmpWidth, $tmpHeight, $srcType) = getimagesize($sourceFile);

        // Rotation management
        $srcW = $tmpWidth;
        $srcH = $tmpHeight;
        $rotate = 0;

        if (function_exists('exif_read_data')) {
            $exif = @exif_read_data($sourceFile);

            if ($exif && isset($exif['Orientation'])) {
                switch ($exif['Orientation']) {
                    case 3:
                        $srcW = $tmpWidth;
                        $srcH = $tmpHeight;
                        $rotate = 180;
                        break;

                    case 6:
                        $srcW = $tmpHeight;
                        $srcH = $tmpWidth;
                        $rotate = -90;
                        break;

                    case 8:
                        $srcW = $tmpHeight;
                        $srcH = $tmpWidth;
                        $rotate = 90;
                        break;

                    default:
                        break;
                }
            }
        }

        return [$srcType, $srcW, $srcH, $rotate];
    }

    private function createCanvas(&$destImage, int $type, int $canvW, int $canvH): void
    {
        $destImage = imagecreatetruecolor($canvW, $canvH);
        if ($type == IMAGETYPE_JPEG) {
            $rgba = imagecolorallocate($destImage, 255, 255, 255);
        } else {
            imagealphablending($destImage, false);
            imagesavealpha($destImage, true);

            $rgba = imagecolorallocatealpha($destImage, 255, 255, 255, 127);
        }

        imagefilledrectangle($destImage, 0, 0, $canvW, $canvH, $rgba);
    }

    public function write(string $type, $resource, string $filename): bool
    {
        switch ($type) {
            case IMAGETYPE_WEBP:
                $quality = (int) $this->pm->get('image_webp_quality') ?? 75;
                $success = imagewebp($resource, $filename, $quality);
                break;

            case IMAGETYPE_PNG:
                $quality = (int) $this->pm->get('image_png_quality') ?? 75;
                $success = imagepng($resource, $filename, $quality);
                break;

            case IMAGETYPE_JPEG:
            default:
                imageinterlace($resource, 1);

                $quality = (int) $this->pm->get('image_jpg_quality') ?? 90;
                $success = imagejpeg($resource, $filename, $quality);
                break;
        }

        imagedestroy($resource);
        @chmod($filename, 0664);

        return $success;
    }
}
