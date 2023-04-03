<?php

namespace App\Manager;

use App\Entity\Page\Page;

class PageManager extends AbstractManager
{
    public const SERVICE_NAME = 'page';

    public function getByKeyword(string $keyword): Page
    {
        $languageId = $this->getLanguageId();

        $pages = $this->em->getRepository(Page::class)->findByKeywordForWebsite($languageId, $keyword);
        if (count($pages) == 0) {
            throw new \Exception('This page does not exist.');
        }

        return $pages[0];
    }

    public function getBySlug(string $slug): ?Page
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Page::class)->findBySlugForWebsite($languageId, $slug);
    }
}
