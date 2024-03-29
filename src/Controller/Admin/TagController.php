<?php

namespace App\Controller\Admin;

use App\Entity\Event\Tag;
use App\Form\Admin\Event\TagType;
use App\Form\Admin\Filters\FilterTagType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class TagController extends CrudController
{
    protected const ENTITY_CLASS = Tag::class;
    protected const TYPE_CLASS = TagType::class;

    protected const NOT_FOUND_MESSAGE = "Ce tag n'existe pas.";

    #[Rest\Get('/tags')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_tag_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/tags/{tagId}', requirements: ['tagId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_tag_one'])]
    public function getOne(Request $request, int $tagId): View
    {
        return parent::getOne($request, $tagId);
    }

    #[Rest\Post('/tags')]
    #[Rest\View(serializerGroups: ['a_all', 'a_tag_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/tags/{tagId}', requirements: ['tagId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_tag_one'])]
    public function edit(Request $request, int $tagId): View
    {
        return parent::edit($request, $tagId);
    }

    #[Rest\Delete('/tags/{tagId}', requirements: ['tagId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_tag_one'])]
    public function delete(Request $request, int $tagId): View
    {
        return parent::delete($request, $tagId);
    }

    #[Rest\Get('/tags/{tagId}/translated/{languageId}', requirements: ['tagId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_tag_one'])]
    public function getTranslated(Request $request, int $tagId, int $languageId): View
    {
        return parent::getTranslated($request, $tagId, $languageId);
    }
}
