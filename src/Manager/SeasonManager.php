<?php

namespace App\Manager;

use App\Entity\Event\Season;

class SeasonManager extends AbstractManager
{
    public const SERVICE_NAME = 'season';

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
        $limitMonth = $this->mf->get('parameter')->get('season_month');

        $month = (int) $date->format('m');
        $year  = $date->format('Y');

        if ($month < $limitMonth) {
            $year--;
        }

        return $year;
    }
}
