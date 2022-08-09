<?php

namespace App\Controller\Admin;

use App\Entity\EventCategory;
use App\Form\Admin\EventCategoryType;
use App\Form\Admin\Filters\FilterEventCategoryType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EventCategoryController extends CrudController
{
    protected const ENTITY_CLASS = EventCategory::class;
    protected const TYPE_CLASS = EventCategoryType::class;

    protected const NOT_FOUND_MESSAGE = "Cette catégorie n'existe pas.";

    #[Rest\Get('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher, int $categoryId = null): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $mainCategory = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters, $categoryId);

        // Hack to delete children which are not needed
        // For the moment, JMS Serializer lazy loads all children categories and there is no efficient way to avoid that
        if (null != $categoryId) {
            foreach ($mainCategory->getChildren() as $child) {
                $child->resetChildren();
            }
        }

        return $this->view($mainCategory, Response::HTTP_OK);
    }

    #[Rest\Post('/event-categories')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $categoryId): View
    {
        return parent::edit($request, $categoryId);
    }

    #[Rest\Delete('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $categoryId): View
    {
        return parent::delete($request, $categoryId);
    }
}
