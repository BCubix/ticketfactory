<?php

namespace App\Manager;

use App\Kernel;
use App\Entity\Media\ImageFormat;
use App\Entity\Product\Product;
use App\Entity\Product\ProductCategory;
use App\Entity\Product\ProductMedia;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class ProductManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'product';

    protected const ENTITY_CLASS = Product::class;

    protected $tr;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        TranslatorInterface $tr
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->tr = $tr;
    }

    protected function getContentLinkTab(): array
    {
        return [
            'ProductCategory' => fn ($languageId, $slug, $activeFilter) => $this->em->getRepository(ProductCategory::class)->findBySlugForWebsite($languageId, $slug, $activeFilter),
        ];
    }

    protected function getBuildContentLinkTab(): array
    {
        return [
            'ProductCategory' => fn ($element) => $element->getMainCategory() !== null ? $element->getMainCategory()->getSlug() : null,
        ];
    }

    public function getFirstFormattedMedia($productMedias, string $slug): ?ProductMedia
    {
        $mediaManager = $this->mf->get('media');
        $imageFormat = $this->em->getRepository(ImageFormat::class)->findOneBySlugForWebsite($slug);

        if (null === $imageFormat) {
            return null;
        }

        foreach ($productMedias as $productMedia) {
            $mediaUrl = $mediaManager->getFormattedImageUrlFromFormat($productMedia->getMedia(), $imageFormat);
            if (null !== $mediaUrl) {
                $productMedia->getMedia()->setDocumentUrl($mediaUrl);
                return $productMedia;
            }
        }

        return null;
    }

    public function getAllFormattedMedias($productMedias, ?string $slug): array
    {
        if (null === $slug) {
            $formatedMedias = [];

            foreach ($productMedias as $productMedia) {
                if (count($productMedia->getMedia()->getImageFormats()) === 0) {
                    $formatedMedias[] = $productMedia;
                }
            }

            return $formatedMedias;
        }

        $mediaManager = $this->mf->get('media');
        $imageFormat = $this->em->getRepository(ImageFormat::class)->findOneBySlugForWebsite($slug);
        $formatedMedias = [];

        if (null === $imageFormat) {
            return [];
        }

        foreach ($productMedias as $productMedia) {
            $mediaUrl = $mediaManager->getFormattedImageUrlFromFormat($productMedia->getMedia(), $imageFormat);
            if (null !== $mediaUrl) {
                $productMedia->getMedia()->setDocumentUrl($mediaUrl);
                $formatedMedias[] = $productMedia;
            }
        }

        return $formatedMedias;
    }

    public function getProducts(int $languageId, array $filters = []): array
    {
        list($products, $pagination) = $this->em->getRepository(Product::class)->findAllForWebsite($languageId, $filters);

        $results = [];
        foreach ($products as $product) {
            $product->frontBuyingButton = $this->getDisplayBookingButton($product);

            $results[] = $product;
        }

        return [$results, $pagination];
    }

    public function getDisplayBookingButton(Product $product): bool
    {
        if (!$product->isDisplayBuyingButton()) {
            return false;
        }

        if (null === $product->getTicketingReference()) {
            return false;
        }

        if ($product->getStock() <= 0) {
            return false;
        }

        if (null === $product->getTicketing() || !$product->getTicketing()->isActive()) {
            return false;
        }

        return true;
    }
}
