<?php

namespace App\Manager;

use App\Entity\Page\Page;
use Symfony\Component\Uid\Uuid;

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

    public function getTranslationByLanguageGroup(?int $languageId, Uuid $languageGroup): ?Page
    {
        if (null === $languageId) {
            $languageId = $this->getLanguageId();
        }

        $page = $this->em->getRepository(Page::class)->findTranslationByLanguageGroupForWebsite($languageId, $languageGroup->toBinary());

        return $page;
    }

    public function getTranslationByKeyword(?int $languageId, string $keyword): Page
    {
        if (null === $languageId) {
            $languageId = $this->getLanguageId();
        }

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

    public function getPageBySlugArray(array $slugs): ?Page
    {
        $result = null;

        foreach($slugs as $slug) {
            $page = $this->mf->get('page')->getBySlug($slug);
            if (null === $page || (null !== $result && (null === $page->getParent() || $result->getId() !== $page->getParent()->getId()))) {
                return null;
            }

            if (null === $result && null !== $page->getParent() && ($page->getParent()->getKeyword() !== 'home' || ($page->getParent()->getSlug() !== "" && null !== $page->getParent()->getSlug()))) {
                return null;
            }

            $result = $page;
        }

        return $result;
    }

    public function getPageSlugPath(Page $page): string
    {
        $slugs = [];

        while (null !== $page) {
            $slugs[] = $page->getSlug();
            $page = $page->getParent();
        }

        $slugs = array_reverse($slugs);
        $slugs = implode('/', $slugs);

        return $slugs;
    }

    public function generatePageBreadCrumbs(Page $page): array
    {
        $breadcrumbs = [];

        while (null !== $page) {
            $breadcrumbs[] = [
                'title' => $page->getTitle(),
                'link' => $this->sf->get('urlService')->tfPath($page),
                'slug' => $page->getSlug(),
            ];

            $page = $page->getParent();
        }

        $breadcrumbs = array_reverse($breadcrumbs);

        return $breadcrumbs;
    }
}
