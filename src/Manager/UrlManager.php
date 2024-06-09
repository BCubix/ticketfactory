<?php

namespace App\Manager;

use App\Entity\Url\Url;

class UrlManager extends AbstractManager
{
    public const SERVICE_NAME = 'url';

    public function orderUrlList(Url $url, ?int $srcPosition, int $destPosition): void
    {
        $list = $this->em->getRepository(Url::class)->findAllForReOrder();

        if (null === $srcPosition) {
            $srcPosition = $url->getPosition();
        }

        if ($srcPosition > $destPosition) {
            // Up position all element between dest include to src exclude
            for ($i = $destPosition; $i < $srcPosition; ++$i) {
                $list[$i - 1]->setPosition($i + 1);
                $this->em->persist($list[$i - 1]);
            }
        } else {
            // Down position of all element between src exclude to dest include
            for ($i = $srcPosition + 1; $i < $destPosition + 1; ++$i) {
                $list[$i - 1]->setPosition($i - 1);
                $this->em->persist($list[$i - 1]);
            }
        }

        // Update new position of the src element
        $list[$srcPosition - 1]->setPosition($destPosition);
        $this->em->persist($list[$srcPosition - 1]);

        $this->em->flush();
    }

    public function findOneByEntityForWebsite(string $entity) {
        return $this->em->getRepository(Url::class)->findByEntityForWebsite($entity);
    }

    public function findOneByKeywordForWebsite(string $keyword) {
        return $this->em->getRepository(Url::class)->findByKeywordForWebsite($keyword);
    }

    public function findOneByKeywordForAdmin(string $keyword) {
        return $this->em->getRepository(Url::class)->findByKeywordForAdmin($keyword);
    }
}
