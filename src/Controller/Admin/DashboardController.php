<?php

namespace App\Controller\Admin;

use App\Entity\Order\Cart;
use App\Entity\Technical\Log;
use App\Entity\Order\Order;
use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Customer\Customer;
use App\Entity\Technical\RequestsLog;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpClient\HttpClient;

#[Rest\Route('/api')]
class DashboardController extends AdminController
{
    #[Rest\Get('/generalInfos')]
    #[Rest\View(serializerGroups: ['a_all'])]
    public function getGeneralInfos(Request $request, ParamFetcher $paramFetcher): View
    {
        $NumberActiveBasket = count($this->em->getRepository(Cart::class)->getAllActiveCarts());
        $NumberRecordedEvent = count($this->em->getRepository(Event::class)->findAll());
        $NumberClients = count(value: $this->em->getRepository(Customer::class)->findAll());
        $NumberActivePeople = count($this->em->getRepository(RequestsLog::class)->getRecentRequestsLog());
        
        $data = [
            ['Visiteurs en ligne', $NumberActivePeople],
            ['Paniers actifs', $NumberActiveBasket],
            ['Événements', $NumberRecordedEvent],
            ['Clients', $NumberClients],
        ];

        return $this->view($data, Response::HTTP_OK);
    }
    
    #[Rest\Get('/generalStats')]
    #[Rest\QueryParam(name: 'beginDate', default: null)]
    #[Rest\QueryParam(name: 'endDate', default: null)]
    #[Rest\View(serializerGroups: ['a_all'])]
    public function getGeneralStats(Request $request, ParamFetcher $paramFetcher): View
    {
        $beginDate = $paramFetcher->get('beginDate');
        $endDate = $paramFetcher->get('endDate');
        
        if ($endDate === null || $endDate === "") {
            $endDate = (new \DateTime())->format('Y-m-d');
        }
        
        if ($beginDate === null  || $beginDate === "") {
            $beginDate = (new \DateTime($endDate))->modify('-1 week')->format('Y-m-d');
        }
        
        $data = $this->mf->get('dashboard')->getGeneralStats($beginDate, $endDate);
        
        return $this->view($data, Response::HTTP_OK);
    }
    
    #[Rest\Get('/healthStatics')]
    #[Rest\View(serializerGroups: ['a_all'])]
    public function getHealthStatics(Request $request, ParamFetcher $paramFetcher): View
    {
        $data = [
            "critical" => [],
            "improvements" => [],
            "noIssue" => []
        ];
        
        $modules = $this->mf->get('module')->getAll();
        $themes = $this->mf->get('theme')->getAll();
        $parameters =  $this->mf->get('parameter')->getAll();
        $addonVersions =$this->mf->get('addonVersion')->getAddonVersions();
        
        // Check que le coeur de Ticket factory est bien à jour
        if (isset($addonVersions["TicketFactory"]))
        {
            $data["improvements"][] = [
                "Mise à jour TicketFactory disponible (" . $addonVersions["TicketFactory"]["version"] . ")",
                false
            ];
        }
        else
        {
            $data["noIssue"][] = [
                "TicketFactory est à jour.",
                true
            ];
        }

        // Check que les themes/modules désactivé soit supprimer 
        $hasUnactiveTheme = false;
        $mainTheme = $this->mf->get('parameter')->getCoreParameter('main_theme');
        foreach($themes as $theme) 
        {
            if (!$theme["name"] != $mainTheme)
            {
                $hasUnactiveTheme = true;
                $data["improvements"][] = ["Vous devriez supprimer les thèmes innutilisés.", false];
                break;
            }
        }
        if (!$hasUnactiveTheme)
        {
            $data["noIssue"][] = ["Vous n'avez aucun les thèmes innutilisés.", true];
        }
        
        $hasUnactiveModule = false;
        foreach($modules['results']  as $module) 
        {
            if (!$module["active"])
            {
                $hasUnactiveModule = true;
                $data["improvements"][] = ["Vous devriez supprimer les modules innutilisés.", false];
                break;
            }
        }
        if (!$hasUnactiveTheme)
        {
            $data["noIssue"][] = ["Vous n'avez aucun les modules innutilisés.", true];
        }
        
        // Check communication with TickerFacctory.fr
        $client = HttpClient::create();
        $response = $client->request('GET', "https://www.ticketfactory.fr", []);
        if ($response->getStatusCode() === 200) {
            $data["noIssue"][] = ["Le site communiquer correctement avec ticketfactory.fr", true];
        }
        else
        {
            $data["critical"][] = ["Le site ne peut pas communiquer avec ticketfactory.fr", false];
        }
        
        $disponibility = $_ENV['APP_ENV'] !== "dev";
        if ($disponibility)
        {
            $data["improvements"][] = ["Le site est en environnement de développement, m'etez le en ligne.", false];
        }
        else
        {
            $data["noIssue"][] = ["Le site est disponible au publique.", true];
        }
        $certificateSSL = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || ($_SERVER['SERVER_PORT'] ?? null) == 443;
        if ($certificateSSL)
        {
            $data["noIssue"][] = ["Le site utilise HTTPS.", true];
        }
        else
        {
            $data["improvements"][] = ["Le site n'utilise pas HTTPS.", false];
        }
        
        return $this->view($data, Response::HTTP_OK);
    }
    
    #[Rest\Get('/salesStats')]
    #[Rest\QueryParam(name: 'beginDate', default: null)]
    #[Rest\QueryParam(name: 'endDate', default: null)]
    #[Rest\View(serializerGroups: ['a_all'])]
    public function getSalesStats(Request $request, ParamFetcher $paramFetcher): View
    {
        $beginDate = $paramFetcher->get('beginDate');
        $endDate = $paramFetcher->get('endDate');
        
        if ($endDate === null || $endDate === "") {
            $endDate = (new \DateTime())->format('Y-m-d');
        }
        
        if ($beginDate === null  || $beginDate === "") {
            $beginDate = (new \DateTime($endDate))->modify('-1 week')->format('Y-m-d');
        }
        
        $data = $this->mf->get('dashboard')->getSalesStats($beginDate, $endDate);
        
        return $this->view($data, Response::HTTP_OK);
    }
    
    #[Rest\Get('/milestones')]
    #[Rest\QueryParam(name: 'beginDate', default: null)]
    #[Rest\QueryParam(name: 'endDate', default: null)]
    #[Rest\View(serializerGroups: ['a_all'])]
    public function getMilestones(Request $request, ParamFetcher $paramFetcher): View
    {
        $subscribers = count($this->em->getRepository(Customer::class)->findAll());
        $orders = count( $this->em->getRepository(Order::class)->findAll());
        
        $milestonesSales = [
            ['achieved' => $orders >= 1, 'text' => '1ère inscription!'],
            ['achieved' => $orders >= 10, 'text' => '10 inscriptions'],
            ['achieved' => $orders >= 50, 'text' => '50 inscriptions'],
            ['achieved' => $orders >= 100, 'text' => '100 inscriptions'],
            ['achieved' => $orders >= 500, 'text' => '500 inscriptions'],
        ];
    
        $milestonesClients = [
            ['achieved' => $subscribers >= 1, 'text' => '1ère vente!'],
            ['achieved' => $subscribers >= 10, 'text' => '10 ventes'],
            ['achieved' => $subscribers >= 50, 'text' => '50 ventes'],
            ['achieved' => $subscribers >= 100, 'text' => '100 ventes'],
            ['achieved' => $subscribers >= 1000, 'text' => '1000 ventes'],
        ];
    
        $data = [
            'milestonesSales' => $milestonesSales,
            'milestonesClients' => $milestonesClients,
        ];
    
        return $this->view($data, Response::HTTP_OK);
    }
    
    #[Rest\Get('/eventDatesSlots')]
    #[Rest\View(serializerGroups: ['a_event_one'])]
    public function getAllEventDatesSlots(Request $request, ParamFetcher $paramFetcher): View
    {
        $eventDate = $this->em->getRepository(EventDate::class)->findAll();
    
        return $this->view([$eventDate], Response::HTTP_OK);
    }
    
    #[Rest\Get('/eventDatesTooltip')]
    #[Rest\View(serializerGroups: ['a_event_one'])]
    public function getAllEventDatesTooltip(Request $request, ParamFetcher $paramFetcher): View
    {
        $events = $this->em->getRepository(Event::class)->findAll();
        
        $data= [];
        foreach($events as $event)
        {
            $eventDates = $event->getEventDates();
            $eventPriceCategories = $event->getEventPriceCategories();
            
            $maxDate = $eventDates[0]->getEventDate();
            $minDate = $eventDates[0]->getEventDate();
            foreach($eventDates as $eventDate)
            {
                $date = $eventDate->getEventDate();
                if ($maxDate < $date)
                {
                    $maxDate = $date;
                }
                if ($minDate > $date)
                {
                    $minDate = $date;
                }
            }
            
            $minPrice = 0;
            $maxPrice = 0;
            foreach($eventPriceCategories as $eventPriceCategory)
            {
                $eventPrices = $eventPriceCategory->getEventPrices();
                foreach($eventPrices as $eventPrice)
                {
                    $price = $eventPrice->getPrice();
                    if ($minPrice == 0)
                    {
                        $minPrice = $price;
                    }
                    
                    if ($minPrice > $price)
                    {
                        $minPrice = $price;
                    }
                    if ($maxPrice < $price)
                    {
                        $maxPrice = $price;
                    }
                }
            }
            
            $data[$event->getId()] = [[$minDate, $maxDate], [$minPrice, $maxPrice]];
        }
    
        return $this->view($data, Response::HTTP_OK);
    }
}
