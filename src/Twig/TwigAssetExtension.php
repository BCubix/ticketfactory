<?php

namespace App\Twig;

use App\Entity\Media\Media;
use App\Manager\MediaManager;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigAssetExtension extends AbstractExtension
{
    protected $mm;

    public function __construct(MediaManager $mm)
    {
        $this->mm = $mm;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('tfAsset', [$this, 'tfAsset']),
            new TwigFunction('formattedAsset', [$this, 'formattedAsset']),
            new TwigFunction('getFirstFormattedAsset', [$this, 'getFirstFormattedAsset'])
        ];
    }

    public function tfAsset(?Media $media): string
    {
        return $media->getDocumentUrl();
    }

    public function formattedAsset(?Media $media, ?string $slug = null): ?Media
    {
        if (null === $media) {
            return null;
        }

        if (null === $slug) {
            return $media;
        }

        return $this->mm->getFormattedImage($media, $slug);
    }

    public function getFirstFormattedAsset(mixed $medias, ?string $slug = null): ?Media
    {
        if (count($medias) === 0) {
            return null;
        }

        if (null === $slug) {
            return $medias[0];
        }

        return $this->mm->getFirstFormattedMedia($medias, $slug);
    }
}
