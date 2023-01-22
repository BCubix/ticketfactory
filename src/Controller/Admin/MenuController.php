<?php

namespace App\Controller\Admin;

use App\Exception\ApiException;
use App\Entity\Menu\MenuEntry;
use App\Manager\MenuEntryManager;
use App\Manager\LanguageManager;
use App\Form\Admin\Menu\MenuEntryType;
use App\Form\Admin\Filters\FilterMenuEntryType;
use App\Service\Hook\HookService;
use App\Service\Logger\Logger;
use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use JMS\Serializer\SerializerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class MenuController extends CrudController
{
    protected const ENTITY_CLASS = MenuEntry::class;
    protected const TYPE_CLASS = MenuEntryType::class;

    protected const NOT_FOUND_MESSAGE = "Cette entrée de menu n'existe pas.";

    protected $mem;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        LanguageManager $lm,
        MenuEntryManager $mem
    ) {
        parent::__construct($em, $se, $fec, $log, $hs, $lm);

        $this->mem = $mem;
    }

    #[Rest\Get('/menus')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $menus = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters);

        $menus = ($menus ?? []);

        if (count($menus) > 0) {
           $menus = $this->lm->getAllTranslations($menus, $this->entityClass, $filters);
        }

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

    #[Rest\Get('/menus/{menusId}/translated/{languageId}', requirements: ['menusId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getTranslated(Request $request, int $menusId, int $languageId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($menusId);
        if (null === $object) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $result = $this->mem->translateMenuEntry($object, $languageId);

        return $this->view($result, Response::HTTP_OK);
    }
}
