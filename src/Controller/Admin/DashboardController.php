<?php

namespace App\Controller\Admin;

use App\Service\Log\Logger;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class DashboardController extends AdminController
{
    #[Rest\Get('/dashboard')]
    #[Rest\QueryParam(name:'tab', default:null)]
    #[Rest\QueryParam(name:'beginDate', default:null)]
    #[Rest\QueryParam(name:'endDate', default:null)]
    #[Rest\View(serializerGroups: ['a_all'])]
    public function index(Request $request, ParamFetcher $paramFetcher): View
    {
        $tab = $paramFetcher->get('tab');
        $beginDate = $paramFetcher->get('beginDate');
        $endDate = $paramFetcher->get('endDate');

        if (null == $beginDate) {
            $beginDate = new \DateTime();
        }

        if (null == $endDate) {
            $endDate = new \DateTime();
            $endDate->sub(new \DateInterval('P1M'));
        }

        // @TODO : Replace fake data with real ones
        if (null == $tab) {
            $data = [
                'col1' => [
                    'onlineVisitors' => 65,
                    'activeBaskets'  => 35,
                    'recordedEvents' => 214,
                    'newsCustomers'  => 3156,
                    'websiteHealth'  => [
                        'score'    => 3,
                        'nbErrors' => 8,
                        'message'  => 'Le site comporte des erreurs critiques à corriger dès que possible.'
                    ]
                ],
                'col2' => [
                    'params' => [
                        'beginDate' => '2022-08-01',
                        'endDate'   => '2022-08-07'
                    ],
                    'numbers' => [
                        'sales' => [
                            'label'  => 'Ventes',
                            'amount' => 3808.35,
                            'unit'   => '€'
                        ],
                        'orders' => [
                            'label'  => 'Commandes',
                            'amount' => 84,
                            'unit'   => 'commandes'
                        ],
                        'tickets' => [
                            'label'  => 'Ticket',
                            'amount' => 217,
                            'unit'   => 'tickets'
                        ],
                        'averageBasket' => [
                            'label'  => 'Panier moyen',
                            'amount' => 45.33,
                            'unit'   => '€'
                        ],
                        'visits' => [
                            'label'  => 'Visites',
                            'amount' => 48809,
                            'unit'   => 'visiteurs'
                        ],
                        'transformation' => [
                            'label'  => 'Taux de transformation',
                            'amount' => 2.1,
                            'unit'   => '%'
                        ]
                    ],
                    'graph' => [
                        'tab' => 'tickets',
                        'values' => [
                            '2022-08-01' => 35,
            				'2022-08-02' => 24,
            				'2022-08-03' => 12,
            				'2022-08-04' => 37,
                            '2022-08-05' => 48,
            				'2022-08-06' => 29,
                            '2022-08-07' => 32
                        ]
                    ]
                ],
                'col3' => [
                    'news' => [
                        [
                            'title' => 'Préparez-vous à vendre comme un pro',
                            'date'  => '2022-07-22',
                            'desc'  => 'Le 5 août est une date à marquer d\'une croix rouge dans votre calendrier, car c\'est là que se déroulera l\'événement commercial de l\'année...',
                            'url'   => 'https://www.ticketfactory.fr/actualites/preparez-vous-a-vendre-comme-un-pro'
                        ], [
                            'title' => '10 conseils pour un site e-commerce BtoB efficace',
                            'date'  => '2022-07-18',
                            'desc'  => 'Vous êtes tenté par la digitalisation de votre activité BtoB mais la liste des freins est longue : comment vont le vivre vos commerciaux ?',
                            'url'   => 'https://www.ticketfactory.fr/actualites/10-conseils-pour-un-site-e-commerce-btob-efficace'
                        ]
                    ],
                    'notes' => 'Ceci est un espace dans lequel vous pouvez saisir vos notes pour ne rien oublier.'
                ]
            ];
        } else {
            $data = [
                'graph' => [
                    'tab' => $tab,
                    'values' => [
                        '2022-08-01' => 35,
                        '2022-08-02' => 24,
                        '2022-08-03' => 12,
                        '2022-08-04' => 37,
                        '2022-08-05' => 48,
                        '2022-08-06' => 29,
                        '2022-08-07' => 32
                    ]
                ]
            ];
        }

        return $this->view($data, Response::HTTP_OK);
    }
}
