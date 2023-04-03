<?php

namespace App\Controller\Admin;

use App\Service\Log\Logger;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class LogController extends AdminController
{
    #[Rest\Get('/logs')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_log_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher, Logger $logger): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $logs = $logger->getLogs($filters);

        return $this->view($logs, Response::HTTP_OK);
    }
}
