<?php

namespace App\Manager;

use App\Entity\Event\Tag;
use App\Entity\Page\Page;

class TagManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'tag';

    protected const ENTITY_CLASS = Tag::class;

    protected function getContentLinkTab(): array
    {
        return [];
    }

    protected function getAttachedPage(): ?Page
    {
        return $this->mf->get('parameter')->getCoreParameter('page_tag');
    }

    public function getBySlug($slug): ?Tag
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Tag::class)->findBySlugForWebsite($languageId, $slug);
    }
}
