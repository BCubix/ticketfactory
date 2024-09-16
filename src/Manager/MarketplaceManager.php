<?php

namespace App\Manager;

use App\Exception\ApiException;
use App\Kernel;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class MarketplaceManager extends AbstractManager
{
    public const SERVICE_NAME = "marketplace";

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
        $this->baseUrl = $mf->get('parameter')->getCoreParameter('marketplace_url');
    }

    public function login(string $username, string $password): array
    {
        $response = $this->client->request('POST', $this->baseUrl . '/admin/api/marketplace/login_check', [
            'json' => [
                'username' => $username,
                'password' => $password,
            ]
        ]);

        if ($response->getStatusCode() === 401) {
            throw new ApiException(Response::HTTP_UNAUTHORIZED, 1401, "Email et/ou mot de passe incorrect.");
        }

        if ($response->getStatusCode() !== 200) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Un problème est survenue lors de la connexion.");
        }

        return $response->toArray();
    }

    public function refreshToken(string $refreshToken): array
    {
        $response = $this->client->request('POST', $this->baseUrl . '/admin/api/marketplace/token/refresh', [
            'json' => [
                'refresh_token' => $refreshToken,
            ]
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Un problème est survenue lors de la connexion.");
        }

        return $response->toArray();
    }
}