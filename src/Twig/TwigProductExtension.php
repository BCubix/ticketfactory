<?php

namespace App\Twig;

use App\Entity\Product\Product;
use App\Entity\Product\ProductMedia;
use App\Manager\FeatureManager;
use App\Manager\LanguageManager;
use App\Manager\ProductManager;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigProductExtension extends AbstractExtension
{
    protected $pm;
    protected $lm;
    protected $rs;
    protected $fm;

    public function __construct(ProductManager $pm, LanguageManager $lm, RequestStack $rs, FeatureManager $fm)
    {
        $this->pm  = $pm;
        $this->lm = $lm;
        $this->rs = $rs;
        $this->fm = $fm;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('getFirstFormattedMediaForProduct', [$this, 'getFirstFormattedMediaForProduct']),
            new TwigFunction('getAllFormattedMediasForProduct', [$this, 'getAllFormattedMediasForProduct']),
            new TwigFunction('getProductFeatures', [$this, 'getProductFeatures']),
        ];
    }

    public function getFirstFormattedMediaForProduct($productMedias, string $slug): ?ProductMedia
    {
        if (count($productMedias) === 0) {
            return null;
        }

        if (null === $slug) {
            return $productMedias[0];
        }

        return $this->pm->getFirstFormattedMedia($productMedias, $slug);
    }

    public function getProductFeatures(Product $product, string $keyword)
    {
        return $this->fm->getProductFeatures($product, $keyword);
    }

    public function getAllFormattedMediasForProduct($productMedias, string $slug): array
    {
        if (count($productMedias) === 0) {
            return [];
        }

        if (null === $slug) {
            return $productMedias;
        }

        return $this->pm->getAllFormattedMedias($productMedias, $slug);
    }
}
