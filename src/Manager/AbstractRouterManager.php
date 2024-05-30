<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Event\EventType;
use App\Entity\Event\Room;
use App\Entity\Event\Season;
use App\Entity\Event\Tag;
use App\Kernel;
use App\Service\ServiceFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

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
        RequestStack $rs
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->entityClass = static::ENTITY_CLASS ?? "";

        $path = explode('\\', $this->entityClass);
        $this->entityClassName = array_pop($path);
    }

    public function getObjectFromUrl(string $url, string $urlFormat, bool $activeFilter): ?array
    {
        $regexPattern = '#^' . preg_replace('/%([^%]+)%/', '(?P<$1>[^/]+)', $urlFormat) . '$#';
        if (!preg_match($regexPattern, $url, $matches)) {
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
        if (null === $result[$this->entityClassName]) {
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
        return [
            'Event' => fn ($languageId, $slug, $activeFilter) => $this->em->getRepository(Event::class)->findBySlugForWebsite($languageId, $slug, $activeFilter),
            'EventCategory' => fn ($languageId, $slug, $activeFilter) => $this->em->getRepository(EventCategory::class)->findBySlugForWebsite($languageId, $slug, $activeFilter),
            'Room' => fn ($languageId, $slug, $activeFilter) => $this->em->getRepository(Room::class)->findBySlugForWebsite($languageId, $slug, $activeFilter),
            'Season' => fn ($languageId, $slug, $activeFilter) => $this->em->getRepository(Season::class)->findBySlugForWebsite($languageId, $slug, $activeFilter),
            'Tag' => fn ($languageId, $slug, $activeFilter) => $this->em->getRepository(Tag::class)->findBySlugForWebsite($languageId, $slug, $activeFilter),
            'EventType' => fn ($languageId, $slug, $activeFilter) => $this->em->getRepository(EventType::class)->findBySlugForWebsite($languageId, $slug, $activeFilter),
        ];
    }

    protected function getObjectFormatTab(): array
    {
        return [
            'id' => fn ($languageId, $formatValue, $activeFilter) => $this->em->getRepository($this->entityClass)->findByIdForWebsite($languageId, $formatValue, $activeFilter),
            'slug' => fn ($languageId, $formatValue, $activeFilter) => $this->em->getRepository($this->entityClass)->findBySlugForWebsite($languageId, $formatValue, $activeFilter),
        ];
    }
}