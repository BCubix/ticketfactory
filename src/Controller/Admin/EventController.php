<?php

namespace App\Controller\Admin;

use App\Entity\Event\Event;
use App\Form\Admin\Event\EventType;
use App\Form\Admin\Filters\FilterEventType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class EventController extends CrudController
{
    protected const ENTITY_CLASS = Event::class;
    protected const TYPE_CLASS = EventType::class;

    protected const NOT_FOUND_MESSAGE = "Cet événement n'existe pas.";

    #[Rest\Get('/events')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/events/{eventId}', requirements: ['eventId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $eventId): View
    {
        return parent::getOne($request, $eventId);
    }

    #[Rest\Post('/events')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/events/{eventId}', requirements: ['eventId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $eventId): View
    {
        return parent::edit($request, $eventId);
    }

    #[Rest\Post('/events/{eventId}/duplicate', requirements: ['eventId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function duplicate(Request $request, int $eventId): View
    {
        return parent::duplicate($request, $eventId);
    }

    #[Rest\Delete('/events/{eventId}', requirements: ['eventId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $eventId): View
    {
        return parent::delete($request, $eventId);
    }
}
