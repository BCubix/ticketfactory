<?php

namespace App\Controller\Admin;

use App\Entity\Event\Room;
use App\Form\Admin\Event\RoomType;
use App\Form\Admin\Filters\FilterRoomType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class RoomController extends CrudController
{
    protected const ENTITY_CLASS = Room::class;
    protected const TYPE_CLASS = RoomType::class;

    protected const NOT_FOUND_MESSAGE = "Cette salle n'existe pas.";

    #[Rest\Get('/rooms')]
    #[Rest\QueryParam(name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_room_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/rooms/{roomId}', requirements: ['roomId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_room_one'])]
    public function getOne(Request $request, int $roomId): View
    {
        return parent::getOne($request, $roomId);
    }

    #[Rest\Post('/rooms')]
    #[Rest\View(serializerGroups: ['a_all', 'a_room_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/rooms/{roomId}', requirements: ['roomId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_room_one'])]
    public function edit(Request $request, int $roomId): View
    {
        return parent::edit($request, $roomId);
    }

    #[Rest\Post('/rooms/{roomId}/duplicate', requirements: ['roomId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_room_one'])]
    public function duplicate(Request $request, int $roomId): View
    {
        return parent::duplicate($request, $roomId);
    }

    #[Rest\Delete('/rooms/{roomId}', requirements: ['roomId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_room_one'])]
    public function delete(Request $request, int $roomId): View
    {
        return parent::delete($request, $roomId);
    }

    #[Rest\Get('/rooms/{roomId}/translated/{languageId}', requirements: ['roomId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_room_one'])]
    public function getTranslated(Request $request, int $roomId, int $languageId): View
    {
        return parent::getTranslated($request, $roomId, $languageId);
    }
}
