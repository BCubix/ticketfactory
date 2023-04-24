<?php

namespace TicketFactory\Module\News\Controller\Admin;

use App\Controller\Admin\CrudController;
use TicketFactory\Module\News\Entity\News\News;
use TicketFactory\Module\News\Form\Admin\News\NewsType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

class NewsController extends CrudController
{
    protected const ENTITY_CLASS = News::class;
    protected const TYPE_CLASS = NewsType::class;

    protected const NOT_FOUND_MESSAGE = "Cette news n'existe pas.";

    #[Rest\Get('/newses')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/newses/{newsId}', requirements: ['newsId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $newsId): View
    {
        return parent::getOne($request, $newsId);
    }

    #[Rest\Post('/newses')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/newses/{newsId}', requirements: ['newsId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $newsId): View
    {
        return parent::edit($request, $newsId);
    }

    #[Rest\Post('/newses/{newsId}/duplicate', requirements: ['newsId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function duplicate(Request $request, int $newsId): View
    {
        return parent::duplicate($request, $newsId);
    }

    #[Rest\Delete('/newses/{newsId}', requirements: ['newsId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $newsId): View
    {
        return parent::delete($request, $newsId);
    }
}
