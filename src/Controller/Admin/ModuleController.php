<?php

namespace App\Controller\Admin;

use App\Entity\Module\Module;
use App\Exception\ApiException;
use App\Manager\ModuleManager;
use App\Service\Hook\HookService;
use App\Service\Logger\Logger;
use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ModuleController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce module n'existe pas.";

    protected $mm;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        ModuleManager $mm
    ) {
        parent::__construct($em, $se, $fec, $log, $hs);

        $this->mm = $mm;
    }

    #[Rest\Get('/modules')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;

        $modules = $this->mm->getAll($filters);

        return $this->view($modules, Response::HTTP_OK);
    }

    #[Rest\Get('/modules/{moduleId}', requirements: ['moduleId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getOne(Request $request, int $moduleId): View
    {
        $module = $this->em->getRepository(Module::class)->findOneForAdmin($moduleId);
        if (is_null($module)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        return $this->view($module, Response::HTTP_OK);
    }

    #[Rest\Post('/modules/{moduleName}/active', requirements: ['moduleName' => '.+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function active(Request $request, string $moduleName): View
    {
        $actionStr = $request->get('action');
        $action = $actionStr !== null ? intval($actionStr) : Module::ACTION_INSTALL;

        $module = $this->mm->active($moduleName, $action, $action === Module::ACTION_INSTALL);

        return $this->view($module, Response::HTTP_OK);
    }
}
