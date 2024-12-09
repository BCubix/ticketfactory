<?php
namespace TicketFactory\Module\ElasticSearch\Controller\Website;

use App\Controller\Website\WebsiteController;
use App\Manager\ManagerFactory;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use TicketFactory\Module\ElasticSearch\Connector\Elastica\ElasticaConnector;
use Twig\Environment;



class ElasticSearchController extends WebsiteController
{
    private const MODULE_NAME = "ElasticSearch";
    protected $ec;

    public function __construct(
        EntityManagerInterface $em,
        RequestStack $rs,
        ManagerFactory $mf,
        ServiceFactory $sf,
        Environment $tg,
        ElasticaConnector $ec
    ) {
        parent::__construct($em, $rs, $mf, $sf, $tg);

        $this->ec = $ec;
    }

    #[Route(path: [
        'en' => '/search',
        'fr' => '/recherche'
    ], name: 'tf_website_search', priority: 10)] public function searchAction()
    {
        $request = $this->getRequest();

        $search = $request->get('elastic_search')['search'];

        if (!$search) {
            return new Response(null, Response::HTTP_BAD_REQUEST);
        }

        $results = $this->getEventResults($search, $this->getLocale());
        $contentResults = $this->getContentResults($search, $this->getLocale());

        return $this->renderModule(self::MODULE_NAME, 'Website/Search/index.html.twig', [
            'events' => $results,
            'contents' => $contentResults,
        ]);
    }

    private function getEventResults(string $search, string $locale): array
    {
        $maxResults = $this->mf->get('parameter')->getModuleParameter(self::MODULE_NAME, 'display_nb_result') ?? 10;
        $displayOldEvents = $this->mf->get('parameter')->getModuleParameter(self::MODULE_NAME, 'display_old_events') ?? false;
        $monthsBefore = $this->mf->get('parameter')->getModuleParameter(self::MODULE_NAME, 'months_before');
        $monthsAfter = $this->mf->get('parameter')->getModuleParameter(self::MODULE_NAME, 'months_after');
        $seasonsBefore = $this->mf->get('parameter')->getModuleParameter(self::MODULE_NAME, 'seasons_before');
        $seasonsAfter = $this->mf->get('parameter')->getModuleParameter(self::MODULE_NAME, 'seasons_after');
        $seasonYear = $this->mf->get('season')->getCurrentSeasonYear();
        $beginSeasonMonth = $this->mf->get('parameter')->getCoreParameter('season_month') ?? 9;

        return $this->ec->search(strtoupper($locale), $search, [
            'maxResults' => $maxResults,
            'displayOldEvents' => $displayOldEvents,
            'monthsBefore' => $monthsBefore,
            'monthsAfter' => $monthsAfter,
            'seasonsBefore' => $seasonsBefore,
            'seasonsAfter' => $seasonsAfter,
            'seasonYear' => $seasonYear,
            'beginSeasonMonth' => $beginSeasonMonth,
        ]);
    }

    private function getContentResults(string $search, string $locale): array
    {
        $maxResults = $this->mf->get('parameter')->getModuleParameter(self::MODULE_NAME, 'display_nb_result') ?? 10;

        return $this->ec->searchContent(strtoupper($locale), $search, [
            'maxResults' => $maxResults,
        ]);
    }
}