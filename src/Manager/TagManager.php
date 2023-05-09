<?php

namespace App\Manager;

use App\Entity\Event\Tag;

class TagManager extends AbstractManager
{
    public const SERVICE_NAME = 'tag';

    public function getBySlug($slug): ?Tag
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Tag::class)->findBySlugForWebsite($languageId, $slug);
    }
}
