<?php

namespace App\Controller\Admin;

use App\Entity\Page\PageBlockType;
use App\Form\Admin\Page\PageBlockTypeType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class PageBlockTypeController extends CrudController
{
    protected const ENTITY_CLASS = PageBlockType::class;
    protected const TYPE_CLASS = PageBlockTypeType::class;

    protected const NOT_FOUND_MESSAGE = "Ce type de bloc n'existe pas.";

    #[Rest\Get('/page-block-types')]
    #[Rest\QueryParam(name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_type_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/page-block-types/{pageBlockTypeId}', requirements: ['pageBlockTypeId' => '\d+'])]
    #[IsGranted('ROLE_PAGE_BLOCK_TYPE_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_type_one'])]
    public function getOne(Request $request, int $pageBlockTypeId): View
    {
        return parent::getOne($request, $pageBlockTypeId);
    }

    #[Rest\Post('/page-block-types')]
    #[IsGranted('ROLE_PAGE_BLOCK_TYPE_CREATE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_type_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/page-block-types/{pageBlockTypeId}', requirements: ['pageBlockTypeId' => '\d+'])]
    #[IsGranted('ROLE_PAGE_BLOCK_TYPE_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_type_one'])]
    public function edit(Request $request, int $pageBlockTypeId): View
    {
        return parent::edit($request, $pageBlockTypeId);
    }

    #[Rest\Delete('/page-block-types/{pageBlockTypeId}', requirements: ['pageBlockTypeId' => '\d+'])]
    #[IsGranted('ROLE_PAGE_BLOCK_TYPE_DELETE')]
    #[Rest\View(serializerGroups: ['a_all', 'a_page_block_type_one'])]
    public function delete(Request $request, int $pageBlockTypeId): View
    {
        return parent::delete($request, $pageBlockTypeId);
    }
}
