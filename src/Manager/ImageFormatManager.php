<?php

namespace App\Manager;

use App\Entity\ImageFormat;
use App\Manager\ParameterManager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File;
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

    public function generateThumbnails(?array $formats, ?array $medias): bool
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

            foreach ($formats as $format) {
                $sourceFile = $mediaFile->getRealPath();
                $destinationFile = $this->mm->getFilePathFromFormat($mediaFile, $format);
                $destW = $format->getLength();
                $destH = $format->getHeight();

                if (!$this->formatImage($sourceFile, $destinationFile, $destW, $destH)) {
                    $success = false;
                }
            }
        }

        return $success;
    }

    public function formatImage(string $sourceFile, string $destinationFile, int $destW, int $destH): ?bool
    {
        // Access file informations
        clearstatcache(true, $sourceFile);
        if (!file_exists($sourceFile) || !filesize($sourceFile)) {
            return null;
        }

        // Getting file informations
        list($srcType, $srcW, $srcH, $rotate) = $this->getImageDetails($sourceFile);
        if ($srcW == 0 || $srcH == 0) {
            return null;
        }

        // Define the new image extension
        $newType = $this->pm->get('image_format');
        if ($newType == 0) {
            $newType = $srcType;
        }

        // Check if image must be cropped
        $crop = $this->pm->get('image_to_crop');

        // Check the image quality
        $quality = $this->pm->get('image_quality');

        // New dimensions initialisation
        $srcX  = 0;
        $srcY  = 0;
        $destX = 0;
        $destY = 0;
        $diffW = $destW / $srcW;
        $diffH = $destH / $srcH;

        // The new image is bigger than the current one
        if ($widthDiff > 1 && $heightDiff > 1) {
            $destW = $srcW;
            $destH = $srcH;
        }

        // Image must be cropped
        elseif ($crop) {
            if ($diffW < $diffH) {
                $srcW = round(($srcW / $diffW * $diffH));
                $srcX = round(($srcW - ($srcW / $diffW * $diffH)) / 2);
            } elseif ($diffH < $diffW) {
                $srcH = round(($srcH / $diffH * $diffW));
                $srcY = round(($srcH - ($srcH / $diffH * $diffW)) / 2);
            }
        }

        // Image must be completed
        else {
            if ($diffW < $diffH) {
                $destH = round($srcH * $destW / $srcW);
            } else {
                $destW = round(($srcW * $destH) / $srcH);
            }
        }

        // @TODO : Check memory limit


        // Creation of a new empty canvas in $destImage
        $this->createCanvas($destImage, $destW, $destH);

        // Get image content and rotate if needed
        $srcImage = $this->create($type, $sourceFile);
        if ($rotate) {
            $srcImage = imagerotate($srcImage, $rotate, 0);
        }

        // New image creation
        imagecopyresampled($destImage, $srcImage, $destX, $destY, $srcX, $srcY, $destW, $destH, $srcW, $srcH);

        $newFile = $this->write($newType, $destImage, $destinationFile);
        @imagedestroy($srcImage);

        return $newFile;
    }

    public function create(int $type, string $filename): mixed
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

    private function createCanvas(&$destImage, int $destW, int $destH): void
    {
        $destImage = imagecreatetruecolor($destW, $destH);
        if ($type == IMAGETYPE_PNG) {
            imagealphablending($destImage, false);
            imagesavealpha($destImage, true);

            $rgba = imagecolorallocatealpha($destImage, 255, 255, 255, 127);
        } else {
            $rgba = imagecolorallocate($destImage, 255, 255, 255);
        }

        imagefilledrectangle($destImage, 0, 0, $destW, $destH, $rgba);
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
