<?php

namespace App\Manager;

use App\Exception\ApiException;
use App\Kernel;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ArticlesManager extends AbstractManager
{
    public const SERVICE_NAME = 'articles';

    private $baseUrl;
    private $client;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        HttpClientInterface $client,
    )
    {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->client = $client;
        $this->baseUrl = "/news";
    }
    
    private function tranformArray(array $apiResponse) : array
    {
        $data = [];
        foreach($apiResponse as $article)
        {
            $transformedArticles = [
                "src" => "https://www.ticketfactory.fr" . $article["mainImg"]["documentUrl"],
                "link" => "https://www.ticketfactory.fr/actualites/" . $article["slug"],
                "title" => $article["title"],
                "shortDescription" => strip_tags($article["shortDescription"]),
            ];
            $data[] = $transformedArticles;
        }
        return $data;
    }

    public function getArticles(): array
    {
        // We get the latest articles
        $response = $this->client->request('GET', "https://www.ticketfactory.fr" . $this->baseUrl, []);
        
        if ($response->getStatusCode() !== 200) {
            return [];
        }

        return $this->tranformArray($response->toArray()) ?? [];
    }
}