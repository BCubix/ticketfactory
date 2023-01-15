<?php

namespace App\Controller\Admin;

use App\Entity\Page\Page;
use App\Form\Admin\Page\PageType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class PageController extends CrudController
{
    protected const ENTITY_CLASS = Page::class;
    protected const TYPE_CLASS = PageType::class;

    protected const NOT_FOUND_MESSAGE = "Cette page n'existe pas.";

    #[Rest\Get('/pages')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/pages/{pageId}', requirements: ['pageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $pageId): View
    {
        return parent::getOne($request, $pageId);
    }

    #[Rest\Post('/pages')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/pages/{pageId}', requirements: ['pageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $pageId): View
    {
        return parent::edit($request, $pageId);
    }

    #[Rest\Post('/pages/{pageId}/duplicate', requirements: ['pageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function duplicate(Request $request, int $pageId): View
    {
        return parent::duplicate($request, $pageId);
    }

    #[Rest\Delete('/pages/{pageId}', requirements: ['pageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $pageId): View
    {
        return parent::delete($request, $pageId);
    }

    #[Rest\Get('/pages/{pageId}/translated/{languageId}', requirements: ['pageId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getTranslated(Request $request, int $pageId, int $languageId): View
    {
        return parent::getTranslated($request, $pageId, $languageId);
    }
}
