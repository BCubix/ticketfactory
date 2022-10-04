<?php

namespace App\Controller\Admin;

use App\Entity\MenuEntry;
use App\Form\Admin\MenuEntryType;
use App\Form\Admin\Filters\FilterMenuEntryType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MenuController extends CrudController
{
    protected const ENTITY_CLASS = MenuEntry::class;
    protected const TYPE_CLASS = MenuEntryType::class;

    protected const NOT_FOUND_MESSAGE = "Cette entrée de menu n'existe pas.";

    #[Rest\Get('/menus')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $menus = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters);

        $menus = ($menus ?? []);

        return $this->view($menus, Response::HTTP_OK);
    }

    #[Rest\Get('/menus/{menuId}', requirements: ['menuId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $menuId): View
    {
        return parent::getOne($request, $menuId);
    }

    #[Rest\Post('/menus')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/menus/{menuId}', requirements: ['menuId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $menuId): View
    {
        return parent::edit($request, $menuId);
    }

    #[Rest\Delete('/menus/{menuId}', requirements: ['menuId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $menuId): View
    {
        return parent::delete($request, $menuId);
    }
}
