<?php

namespace App\Twig;

use App\Entity\Media\Media;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigAssetExtension extends AbstractExtension
{
    public function getFunctions()
    {
        return [
            new TwigFunction('tfAsset', [$this, 'tfAsset'])
        ];
    }

    public function tfAsset(?Media $media): string
    {
        return $media->getDocumentUrl();
    }
}
