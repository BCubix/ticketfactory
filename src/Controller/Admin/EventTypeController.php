<?php

namespace App\Controller\Admin;

use App\Entity\Event\EventType;
use App\Form\Admin\Event\EventTypeType;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class EventTypeController extends CrudController
{
    protected const ENTITY_CLASS = EventType::class;
    protected const TYPE_CLASS = EventTypeType::class;

    protected const NOT_FOUND_MESSAGE = "Ce type n'existe pas.";

    #[Rest\Get('/event-types')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_type_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/event-types/{eventTypeId}', requirements: ['eventTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_type_one'])]
    public function getOne(Request $request, int $eventTypeId): View
    {
        return parent::getOne($request, $eventTypeId);
    }

    #[Rest\Post('/event-types')]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_type_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/event-types/{eventTypeId}', requirements: ['eventTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_type_one'])]
    public function edit(Request $request, int $eventTypeId): View
    {
        return parent::edit($request, $eventTypeId);
    }

    #[Rest\Post('/event-types/{eventTypeId}/duplicate', requirements: ['eventTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_type_one'])]
    public function duplicate(Request $request, int $eventTypeId): View
    {
        return parent::duplicate($request, $eventTypeId);
    }

    #[Rest\Delete('/event-types/{eventTypeId}', requirements: ['eventTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_type_one'])]
    public function delete(Request $request, int $eventTypeId): View
    {
        return parent::delete($request, $eventTypeId);
    }
}
