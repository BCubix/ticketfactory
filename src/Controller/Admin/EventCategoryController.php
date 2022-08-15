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

        // Hacks to delete parents and children which are not needed
        // For the moment, JMS Serializer lazy loads all categories and there is no efficient way to avoid that
        if (null != $categoryId) {
            foreach ($mainCategory->getChildren() as $child) {
                $child->resetChildren();
            }
        }

        $parent = $mainCategory->getParent();
        while (null != $parent) {
            $parent->resetChildren();

            $parent = $parent->getParent();
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
        $mainCategory = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters, $categoryId);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $event = new CrudObjectInstantiatedEvent($object, 'delete');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $objectId = $object->getId();

        $this->attachProductsToRootCategory($mainCategory);

        $this->em->remove($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', $this->entityClass, $objectId);

        return $this->view(null, Response::HTTP_OK);
    }

    // @Todo : Move this function into the associated CrudObjectInstantiatedEvent
    private function attachProductsToRootCategory(EventCategory $mainCategory) {
        $rootCategory = $this->em->getRepository($this->entityClass)->findRootCategory();
        $childrenCategories = $this->em->getRepository($this->entityClass)->getChildren($mainCategory, false, null, 'asc', true);

        foreach ($childrenCategories as $category) {
            $events = $category->getEvents();

            foreach ($events as $event) {
                $event->setMainCategory($rootCategory);
                $this->em->persist($event);
            }
        }
    }
}
