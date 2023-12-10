<?php

namespace App\Manager;

use App\Entity\Media\ImageFormat;
use App\Entity\Product\ProductMedia;
use App\Kernel;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class ProductManager extends AbstractManager
{
    public const SERVICE_NAME = 'product';

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

    public function getAllFormattedMedias($productMedias, string $slug): array
    {
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
}
