<?php

namespace App\Controller\Admin;

use App\Entity\Module\Module;
use App\Exception\ApiException;
use App\Manager\ModuleManager;
use App\Service\Logger\Logger;
use App\Service\ModuleTheme\Service\ModuleService;
use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ModuleController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce module n'existe pas.";

    protected $mm;
    protected $ms;
    protected $fs;

    public function __construct(
        EventDispatcherInterface $ed,
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        ModuleManager $mm,
        ModuleService $ms,
        Filesystem $fs
    ) {
        parent::__construct($ed, $em, $se, $fec, $log);

        $this->mm = $mm;
        $this->ms = $ms;
        $this->fs = $fs;
    }

    #[Rest\Get('/modules')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $objects = $this->em->getRepository(Module::class)->findAllForAdmin($filters);

        if (!isset($filters['active'])) {
            $modules = $this->ms->getAllInDisk();

            $objects['results'] = $modules;
            $objects['total'] = count($modules);
        }

        return $this->view($objects, Response::HTTP_OK);
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

        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            $modulePath = $this->ms->getDir() . '/' . $moduleName;
            if (!is_dir($modulePath)) {
                throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le dossier $modulePath n'existe pas.");
            }

            if ($action === Module::ACTION_UNINSTALL_DELETE) {
                $this->fs->remove($modulePath);
            } else {
                $this->ms->install($moduleName);
                $module = $this->mm->createNewModule($moduleName);
            }
        } else {
            $this->mm->doAction($module, $action);
        }

        return $this->view($module, Response::HTTP_OK);
    }
}