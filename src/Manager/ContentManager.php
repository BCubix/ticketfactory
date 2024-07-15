<?php

namespace App\Manager;

use App\Entity\Content\Content;
use App\Entity\Url\Url;

class ContentManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'content';

    protected const ENTITY_CLASS = Content::class;

    public function getContentObjectFromUrl(Url $url, string $slug, string $urlFormat, bool $activeFilter): ?array
    {
        $regexPattern = '#^' . preg_replace('/%([^%]+)%/', '(?P<$1>[^/]+)', $urlFormat) . '$#';
        if (!preg_match($regexPattern, $slug, $matches)) {
            return null;
        }

        $formatValue = null;
        foreach (static::UNIQ_IDENTIFIER as $eventIdentifier) {
            if (isset($matches[$eventIdentifier])) {
                $formatValue = $matches[$eventIdentifier];
                break;
            }
        }

        if (null === $formatValue) {
            return null;
        }

        $languageId = $this->getLanguageId();

        $result = [];
        $result[$this->entityClassName] = $this->getObjectFromFormat($formatValue, $eventIdentifier, $languageId, $activeFilter);
        if (null === $result[$this->entityClassName] || $url->getKeyword() !== ('content_' . $result[$this->entityClassName]->getContentType()->getId())) {
            return null;
        }

        $checkLinkedContentUrl = $this->getContentLinkTab();
        foreach ($matches as $key => $value) {
            if (!isset($checkLinkedContentUrl[$key])) {
                continue;
            }

            if ($key === $this->entityClassName) {
                return null;
            }

            $result[$key] = $checkLinkedContentUrl[$key]($languageId, $value, $activeFilter);

            if (null === $result[$key] || $result[$key] === false) {
                return null;
            }
        }

        return $result;
    }

    public function getOneBySlug(string $slug): ?Content
    {
        return $this->em->getRepository(Content::class)->findOneBySlugForWebsite($slug);
    }

    public function getAllByTypeKeyword(?int $languageId, string $keyword): array
    {
        if (null === $languageId) {
            $languageId = $this->getLanguageId();
        }

        return $this->em->getRepository(Content::class)->findAllByTypeKeywordForWebsite($languageId, $keyword);
    }

    public function getAllByTypeIdForWebsite(?int $languageId, int $id): array
    {
        if (null === $languageId) {
            $languageId = $this->getLanguageId();
        }

        return $this->em->getRepository(Content::class)->findAllByTypeIdForWebsite($languageId, $id);
    }
}