<?php

namespace App\Manager;

use App\Entity\Technical\RequestsLog;
use App\Entity\Order\Order;
use App\Entity\Customer\Customer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class DashboardManager extends AbstractManager
{
    public const SERVICE_NAME = 'dashboard';

    private function getAddingFormat(\DateTime $beginDate, \DateTime $endDate): string
    {
        $dateDifference = $endDate->diff($beginDate);

        if ($dateDifference->d <= 10 && $dateDifference->y < 1 && $dateDifference->m < 1) {
            return '+1 day';
        }
        
        if ($dateDifference->y < 1 && $dateDifference->m <= 3)
        {
            return '+1 week';
        }
        
        if ($dateDifference->y < 2) 
        {
            return '+1 month';
        }
        
        return '+1 year';
    }

    private function generateTagName(\DateTime $beginDate, string $adding): string
    {
        $formatter = new \IntlDateFormatter(
            'fr_FR',
            \IntlDateFormatter::MEDIUM,
            \IntlDateFormatter::NONE
        );

        switch ($adding) {
            case '+1 year':
                return $beginDate->format('Y');
            case '+1 month':
                $formatter->setPattern('MMM yyyy');
                return ucfirst($formatter->format($beginDate));
            case '+1 week':
                $formatter->setPattern('d MMM'); 
            
                $startOfWeek = ucfirst($formatter->format($beginDate));
                $endOfWeek = ucfirst($formatter->format((clone $beginDate)->modify('+6 days')));
                
                return "$startOfWeek - $endOfWeek";
            case '+1 day':
                return $beginDate->format('d M.');
            default:
                return $beginDate->format('Y-m-d');
        }
    }


    public function getClientVisits(\DateTime $beginDate, \DateTime $endDate, string $adding): array
    {   
        $data = [];
        $total = 0;
        
        while ($beginDate < $endDate) {
            $aux = clone $beginDate;
            $aux->modify($adding);

            $logs = $this->em->getRepository(RequestsLog::class)->findBetweenDates($beginDate, $aux);
            $total += $logs;
            
            $data[] = [
                "name" => $this->generateTagName($beginDate, $adding),
                "visitors" => $logs
            ];

            $beginDate = $aux;
        }
        return [$data, $total];
    }
    
    public function getSubscriptions(\DateTime $beginDate, \DateTime $endDate, string $adding): array
    {   
        $data = [];
        $total = 0;
        
        while ($beginDate < $endDate) {
            $aux = clone $beginDate;
            $aux->modify($adding);

            $logs = $this->em->getRepository(Customer::class)->findBetweenDates($beginDate, $aux);
            $total += $logs;
            
            $data[] = [
                "name" => $this->generateTagName($beginDate, $adding),
                "subscriptions" => $logs
            ];

            $beginDate = $aux;
        }
        
        return [$data, $total];
    }
    
    public function getTrafficOnSite(\DateTime $beginDate, \DateTime $endDate, string $adding) : array
    {
        $data = [];
        $total = 0;
        
        while ($beginDate < $endDate) {
            $aux = clone $beginDate;
            $aux->modify($adding);

            $logs = $this->em->getRepository(RequestsLog::class)->findBetweenDatesNonUnique($beginDate, $aux);
            $total += $logs;
            
            $data[] = [
                "name" => $this->generateTagName($beginDate, $adding),
                "traffic" => $logs
            ];

            $beginDate = $aux;
        }
        
        return [$data, $total];
    }
    
    public function getGeneralStats(string $beginDate, string $endDate) : array
    {
        if (null == $beginDate) {
            $beginDate = new \DateTime();
        } else {   
            $beginDate = new \DateTime($beginDate);
        }

        if (null == $endDate) {
            $endDate = new \DateTime();
            $endDate->sub(new \DateInterval('P1M'));
        } else {
            $endDate = new \DateTime($endDate);
        }
        
        $adding = $this->getAddingFormat($beginDate, $endDate);
        
        $clientVisits = $this->getClientVisits($beginDate, $endDate, $adding);
        $clientSubcriptions = $this->getSubscriptions($beginDate, $endDate, $adding);
        $trafficNumber = $this->getTrafficOnSite($beginDate, $endDate, $adding);
        
        $data =[ 
                'params' => [
                    'beginDate' => '2024-08-01',
                    'endDate' => '2024-08-07'
                ],
               'numbers' => [
                    'visitors' => [
                        'label' => 'Visiteurs',
                    ],
                    'subscriptions' => [
                        'label' => 'Inscriptions',
                    ],
                    'pageTrafic' => [
                        'label' => 'Trafic Pages',
                    ],
                ],
                'graph' => [ 'visitors' => $clientVisits[0],
                             'subscriptions' => $clientSubcriptions[0],
                             'traffic' => $trafficNumber[0],
        ]];
        return $data;
    }
    
    private function getSalesData(\DateTime $beginDate, \DateTime $endDate, string $adding) : array
    {
        $data =[
           'numbers' => [
                'sales' => [
                    'label' => 'Ventes',
                ],
                'orders' => [
                    'label' => 'Commandes',
                ],
                'averageCart' => [
                    'label' => 'Panier Moyen',
                ],
            ],
            'graph' => [ 'sales' => [],
                         'orders' => [],
                         'averageCart' => [],
        ]];
        $total = 0;
        
        while ($beginDate < $endDate) {
            $aux = clone $beginDate;
            $aux->modify($adding);

            $orders = $this->em->getRepository(Order::class)->findBetweenDates($beginDate, $aux);
            
            $salesAmounts = 0;
            foreach($orders as $order)
            {
                $cart = $order->getCart();
                $salesAmounts += $cart->getTotal();
            }
            $ordersAmount = count($orders);
            $averageCartAmount = 0;
            if ($ordersAmount != 0)
            {
                $averageCartAmount = $salesAmounts / ($ordersAmount);
            }
            
            $name = $this->generateTagName($beginDate, $adding);
            $data['graph']['sales'][] = [
                "name" => $name,
                "sales" => $salesAmounts,
            ];
            $data['graph']['orders'][] = [
                "name" => $name,
                "orders" => $ordersAmount,
            ];
            $data['graph']['averageCart'][] = [
                "name" => $name,
                "averageCart" => $averageCartAmount,
            ];

            $beginDate = $aux;
        }
        
        return $data;
    }
    
    public function getSalesStats(string $beginDate, string $endDate) : array
    {
        if (null == $beginDate) {
            $beginDate = new \DateTime();
        } else {   
            $beginDate = new \DateTime($beginDate);
        }

        if (null == $endDate) {
            $endDate = new \DateTime();
            $endDate->sub(new \DateInterval('P1M'));
        } else {
            $endDate = new \DateTime($endDate);
        }
        
        $adding = $this->getAddingFormat($beginDate, $endDate);
        
        $data = $this->getSalesData($beginDate, $endDate, $adding);
        return $data;
    }
}
