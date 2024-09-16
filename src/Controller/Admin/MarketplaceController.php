<?php

namespace App\Controller\Admin;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api/marketplace')]
class MarketplaceController extends AdminController
{
    #[Rest\Post('/sign-in')]
    public function marketplaceLogin(Request $request): View
    {
        // We get the username and password from the request to connect to the marketplace as a customer
        $username = $request->get('username');
        $password = $request->get('password');

        // We try to connect to the marketplace and get token and refresh_token if succeed
        $result = $this->mf->get('marketplace')->login($username, $password);

        return $this->view($result, Response::HTTP_OK);
    }

    #[Rest\Post('/refresh-token')]
    public function marketplaceRefreshToken(Request $request): View
    {
        // We get the refresh_token from the request
        $refreshToken = $request->get('refresh_token');

        // We try to get a new token from the marketplace
        $result = $this->mf->get('marketplace')->refreshToken($refreshToken);

        return $this->view($result, Response::HTTP_OK);
    }
}