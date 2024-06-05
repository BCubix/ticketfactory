<?php

namespace App\Manager;

use App\Entity\Event\Season;
use App\Entity\Page\Page;

class SeasonManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'season';

    protected const ENTITY_CLASS = Season::class;

    protected function getContentLinkTab(): array
    {
        return [];
    }

    protected function getAttachedPage(): ?Page
    {
        return $this->mf->get('parameter')->getCoreParameter('page_season');
    }

    public function getSeasons(): array
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Season::class)->findAllForWebsite($languageId);
    }

    public function getCurrentSeasonYear(): int
    {
        return $this->getSeasonYearFromDate(new \DateTime);
    }

    public function getCurrentSeason(): ?Season
    {
        $languageId = $this->getLanguageId();
        $currentYear = $this->getCurrentSeasonYear();

        return $this->em->getRepository(Season::class)->findByBeginYearForWebsite($languageId, $currentYear);
    }

    public function getNextSeasonYear(): int
    {
        return $this->getCurrentSeasonYear() + 1;
    }

    public function getNextSeason(): ?Season
    {
        $languageId = $this->getLanguageId();
        $nextYear = $this->getNextSeasonYear();

        return $this->em->getRepository(Season::class)->findByBeginYearForWebsite($languageId, $nextYear);
    }

    public function getSeasonFromDate(\DateTime $date): ?Season
    {
        $languageId = $this->getLanguageId();
        $year = $this->getSeasonYearFromDate($date);

        return $this->em->getRepository(Season::class)->findByBeginYearForWebsite($languageId, $year);
    }

    public function getBySlug($slug): ?Season
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Season::class)->findBySlugForWebsite($languageId, $slug);
    }

    private function getSeasonYearFromDate(\Datetime $date): int
    {
        $limitMonth = $this->mf->get('parameter')->getCoreParameter('season_month') ?? 9;

        $month = (int) $date->format('m');
        $year  = $date->format('Y');

        if ($month < $limitMonth) {
            $year--;
        }

        return ($year);
    }
}
