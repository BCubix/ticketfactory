<?php

namespace App\Controller\Admin;

use App\Entity\Event\Season;
use App\Form\Admin\Event\SeasonType;
use App\Form\Admin\Filters\FilterSeasonType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;

#[Rest\Route('/api')]
class SeasonController extends CrudController
{
    protected const ENTITY_CLASS = Season::class;
    protected const TYPE_CLASS = SeasonType::class;

    protected const NOT_FOUND_MESSAGE = "Cette saison n'existe pas.";

    #[Rest\Get('/seasons')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_season_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/seasons/{seasonId}', requirements: ['seasonId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_season_one'])]
    public function getOne(Request $request, int $seasonId): View
    {
        return parent::getOne($request, $seasonId);
    }

    #[Rest\Post('/seasons')]
    #[Rest\View(serializerGroups: ['a_all', 'a_season_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/seasons/{seasonId}', requirements: ['seasonId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_season_one'])]
    public function edit(Request $request, int $seasonId): View
    {
        return parent::edit($request, $seasonId);
    }

    #[Rest\Post('/seasons/{seasonId}/duplicate', requirements: ['seasonId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_season_one'])]
    public function duplicate(Request $request, int $seasonId): View
    {
        return parent::duplicate($request, $seasonId);
    }

    #[Rest\Delete('/seasons/{seasonId}', requirements: ['seasonId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_season_one'])]
    public function delete(Request $request, int $seasonId): View
    {
        return parent::delete($request, $seasonId);
    }

    #[Rest\Get('/seasons/{seasonId}/translated/{languageId}', requirements: ['seasonId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_season_one'])]
    public function getTranslated(Request $request, int $seasonId, int $languageId): View
    {
        return parent::getTranslated($request, $seasonId, $languageId);
    }
}
