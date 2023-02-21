<?php

namespace App\Controller\Admin;

use App\Entity\Page\PageBlock;
use App\Form\Admin\Page\PageBlockType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class PageBlockController extends CrudController
{
    protected const ENTITY_CLASS = PageBlock::class;
    protected const TYPE_CLASS = PageBlockType::class;

    protected const NOT_FOUND_MESSAGE = "Ce bloc n'existe pas.";

    #[Rest\Get('/page-blocks')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/page-blocks/{blockId}', requirements: ['blockId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_one'])]
    public function getOne(Request $request, int $blockId): View
    {
        return parent::getOne($request, $blockId);
    }

    #[Rest\Post('/page-blocks')]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/page-blocks/{blockId}', requirements: ['blockId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_one'])]
    public function edit(Request $request, int $blockId): View
    {
        return parent::edit($request, $blockId);
    }

    #[Rest\Post('/page-blocks/{blockId}/duplicate', requirements: ['blockId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_one'])]
    public function duplicate(Request $request, int $blockId): View
    {
        return parent::duplicate($request, $blockId);
    }

    #[Rest\Delete('/page-blocks/{blockId}', requirements: ['blockId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_one'])]
    public function delete(Request $request, int $blockId): View
    {
        return parent::delete($request, $blockId);
    }

    #[Rest\Get('/page-blocks/{pageBlockId}/translated/{languageId}', requirements: ['pageBlockId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_one'])]
    public function getTranslated(Request $request, int $pageBlockId, int $languageId): View
    {
        return parent::getTranslated($request, $pageBlockId, $languageId);
    }
}
