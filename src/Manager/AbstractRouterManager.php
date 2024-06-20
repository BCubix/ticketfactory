<?php

namespace App\Manager;

use App\Entity\Page\Page;
use App\Entity\Url\Url;
use App\Kernel;
use App\Service\ServiceFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\RouterInterface;

class AbstractRouterManager extends AbstractManager
{
    public const SERVICE_NAME = "router";

    protected const ENTITY_CLASS = null;
    protected const UNIQ_IDENTIFIER = ['id', 'slug'];

    protected $entityClass;
    protected $entityClassName;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->entityClass = static::ENTITY_CLASS ?? "";

        $path = explode('\\', $this->entityClass);
        $this->entityClassName = array_pop($path);
    }

    public function getObjectFromUrl(string $url, string $urlFormat, bool $activeFilter): ?array
    {
        // We check if url corresponds to the pattern and we get the matches parts
        $regexPattern = '#^' . preg_replace('/%([^%]+)%/', '(?P<$1>[^/]+)', $urlFormat) . '$#';
        if (!preg_match($regexPattern, $url, $matches)) {
            return null;
        }

        // We get the unique identifier key (usually "id" or "slug")
        $formatValue = null;
        foreach (static::UNIQ_IDENTIFIER as $eventIdentifier) {
            if (isset($matches[$eventIdentifier])) {
                $formatValue = $matches[$eventIdentifier];
                break;
            }
        }

        // We check if we have a unique identifier into urlFormat
        if (null === $formatValue) {
            return null;
        }


        // We get the main content wich corresponds to the entityClassName
        $result = [];
        $languageId = $this->getLanguageId();
        $result[$this->entityClassName] = $this->getObjectFromFormat($formatValue, $eventIdentifier, $languageId, $activeFilter);
        if (null === $result[$this->entityClassName]) {
            return null;
        }

        // We get the ContentLinkTab to get the contents that are linked to the entity
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

    public function buildUrl(mixed $element, Url $urlFormat, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH) {
        $url = $urlFormat->getSlug();

        // We check if urlFormat has an attached page then we had its path to url
        $attachedPage = $this->getAttachedPage($urlFormat);
        if (null !== $attachedPage) {
            $url = $this->mf->get('page')->getPageSlugPath($attachedPage) . "/" . $url;
        }

        // We get the related contents identifier from the main element to construct url
        $buildContentLinkTab = $this->getBuildContentLinkTab();
        foreach ($buildContentLinkTab as $key => $contentLink) {
            if (str_contains($url, "%" . $key . "%")) {
                $result = $contentLink($element);
                if (null === $result) {
                    return "";
                }

                $url = str_replace("%" . $key . "%", $result, $url);
            }
        }

        // We get the main element identifier to construct url
        $buildObjectFormatTab = $this->getBuildObjectFormatTab();
        foreach ($buildObjectFormatTab as $key => $objectFormat) {
            if (str_contains($url, "%" . $key . "%")) {
                $url = str_replace("%" . $key . "%", $objectFormat($element), $url);
            }
        }

        // We set the parameters with slug and language for translated url
        $parameters = ['slugs' => $url];
        if (method_exists($element, 'getLang')) {
            $parameters['_locale'] = $element->getLang()->getLocale();
        }

        return $this->sf->get('urlService')->generateUrl('tf_website_global', $parameters, $absolute);
    }

    public function buildUrlFromKeyword(Url $urlFormat, array $parameters = [], int $absolute = RouterInterface::ABSOLUTE_PATH)
    {
        $url = $urlFormat->getSlug();

        // We check if urlFormat has an attached page then we had its path to url
        $attachedPage = $this->getAttachedPage($urlFormat);
        if (null !== $attachedPage) {
            $url = $this->mf->get('page')->getPageSlugPath($attachedPage) . "/" . $url;
        }

        // We get the contents identifiers from parameters
        $buildContentTab = $this->getBuildContentTab();
        foreach ($buildContentTab as $key => $content) {
            if (str_contains($url, "%" . $key . "%")) {
                $result = $content($parameters);
                if (null === $result) {
                    return "";
                }

                $url = str_replace("%" . $key . "%", $result, $url);
            }
        }

        // We get the main content identifier to construct url
        $buildObjectTab = $this->getBuildObjectTab();
        foreach ($buildObjectTab as $key => $object) {
            if (str_contains($url, "%" . $key . "%")) {
                $url = str_replace("%" . $key . "%", $object($parameters), $url);
            }
        }

        // We set the parameters with slug and language for translated url
        $parameters['slugs'] = $url;
        foreach($parameters as $parameter) {
            if (!isset($parameters['_locale']) && gettype($parameter) === 'object' && method_exists($parameter, 'getLang')) {
                $parameters['_locale'] = $parameter->getLang()->getLocale();
                break;
            }
        }

        return $this->sf->get('urlService')->generateUrl('tf_website_global', $parameters, $absolute);
    }

    public function getAttachedPage(Url $url): ?Page
    {
        // We get the languageId and page to use it for translated pages
        $languageId = $this->getLanguageId();
        $page = $url->getPage();

        if (null === $page) {
            return null;
        }

        // If page language doesn't correspond to languageId, we get the translated page
        if ($page->getLang()->getId() !== $languageId) {
            return $this->mf->get('page')->getTranslationByLanguageGroup($languageId, $page->getLanguageGroup());
        }

        return $page;
    }

    public function generateBreadcrumbs(?Page $attachedPage, Url $url, string $slug, array $contents): array
    {
        // We get The BreadcrumbsTab to get titles and slug for contents
        $breadCrumbTitleTab = $this->getBreadCrumbTab();
        $breadcrumbs = [];

        // We get the attached Page to add paths to breadcrumbs
        if (null !== $attachedPage) {
            $breadcrumbs = $this->mf->get('page')->generatePageBreadcrumbs($attachedPage);
        }

        // We check each part of url to get the contents infos and url
        $parts = explode('/', trim($url->getSlug(), '/'));
        foreach ($parts as $part) {
            if (preg_match('/%([^%]+)%/', $part, $match)) {
                $key = $match[1];
                if (in_array($key, static::UNIQ_IDENTIFIER)) {
                    $key = $this->entityClassName;
                }

                if (isset($contents[$key]) && isset($breadCrumbTitleTab[$key])) {
                    $objectBreadcrumb = $breadCrumbTitleTab[$key]($contents[$key]);
                    $link = $this->sf->get('urlService')->tfPath($contents[$key]);

                    $breadcrumbs[] = [
                        'title' => $objectBreadcrumb['title'],
                        'link' => $link,
                        'slug' => $objectBreadcrumb['slug']
                    ];
                }
            }
        }

        return $breadcrumbs;
    }

    protected function getObjectFromFormat(string $formatValue, string $format, int $languageId, bool $activeFilter): mixed
    {
        $checkObjectFormatUrl = $this->getObjectFormatTab();

        if (!isset($checkObjectFormatUrl[$format])) {
            return null;
        }

        return $checkObjectFormatUrl[$format]($languageId, $formatValue, $activeFilter);
    }

    protected function getContentLinkTab(): array
    {
        return [];
    }

    protected function getObjectFormatTab(): array
    {
        return [
            'id' => fn ($languageId, $formatValue, $activeFilter) => $this->em->getRepository($this->entityClass)->findByIdForWebsite($languageId, $formatValue, $activeFilter),
            'slug' => fn ($languageId, $formatValue, $activeFilter) => $this->em->getRepository($this->entityClass)->findBySlugForWebsite($languageId, $formatValue, $activeFilter),
        ];
    }

    protected function getBuildContentLinkTab(): array
    {
        return [];
    }

    protected function getBuildObjectFormatTab(): array
    {
        return [
            'id' => fn ($element) => $element->getId(),
            'slug' => fn ($element) => $element->getSlug(),
        ];
    }

    protected function getBuildContentTab(): array
    {
        return [];
    }

    protected function getBuildObjectTab(): array
    {
        return [];
    }

    protected function getBreadCrumbTab(): array
    {
        return [
            'EventCategory'    => fn ($object) => ['title' => $object->getName(), 'slug' => $object->getSlug()],
            'EventType'        => fn ($object) => ['title' => $object->getName(), 'slug' => $object->getSlug()],
            'Season'           => fn ($object) => ['title' => $object->getName(), 'slug' => $object->getSlug()],
            'Room'             => fn ($object) => ['title' => $object->getName(), 'slug' => $object->getSlug()],
            'Event'            => fn ($object) => ['title' => $object->getName(), 'slug' => $object->getSlug()],
            'Tag'              => fn ($object) => ['title' => $object->getName(), 'slug' => $object->getSlug()],
            'Content'          => fn ($object) => ['title' => $object->getTitle(), 'slug' => $object->getSlug()],
            'Product'          => fn ($object) => ['title' => $object->getName(), 'slug' => $object->getSlug()],
            'ProductCategory'  => fn ($object) => ['title' => $object->getName(), 'slug' => $object->getSlug()],
        ];
    }

}