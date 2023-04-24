<?php

namespace TicketFactory\Module\Info\Controller\Admin;

use App\Controller\Admin\CrudController;
use TicketFactory\Module\Info\Entity\Info\Info;
use TicketFactory\Module\Info\Form\Admin\Info\InfoType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

class InfoController extends CrudController
{
    protected const ENTITY_CLASS = Info::class;
    protected const TYPE_CLASS = InfoType::class;

    protected const NOT_FOUND_MESSAGE = "Cette information n'existe pas.";

    #[Rest\Get('/infos')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/infos/{infoId}', requirements: ['infoId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $infoId): View
    {
        return parent::getOne($request, $infoId);
    }

    #[Rest\Post('infos')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/infos/{infoId}', requirements: ['infoId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $infoId): View
    {
        return parent::edit($request, $infoId);
    }

    #[Rest\Post('/infos/{infoId}/duplicate', requirements: ['infoId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function duplicate(Request $request, int $infoId): View
    {
        return parent::duplicate($request, $infoId);
    }

    #[Rest\Delete('/infos/{infoId}', requirements: ['infoId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $infoId): View
    {
        return parent::delete($request, $infoId);
    }
}
