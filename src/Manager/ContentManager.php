<?php

namespace App\Manager;

use App\Entity\Content\Content;

class ContentManager extends AbstractManager
{
    public const SERVICE_NAME = 'content';

    public function getOneBySlug(string $slug): ?Content
    {
        return $this->em->getRepository(Content::class)->findOneBySlugForWebsite($slug);
    }

    public function getAllByTypeKeyword(string $keyword): array
    {
        return $this->em->getRepository(Content::class)->findAllByTypeKeyword($keyword);
    }
}
