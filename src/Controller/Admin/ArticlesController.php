<?php

namespace App\Controller\Admin;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class ArticlesController extends AdminController
{
    #[Rest\Get('/articles')]
    public function getArticles(): View
    {
        $results = $this->mf->get('articles')->getArticles();
        return $this->view($results, Response::HTTP_OK);
    }
}