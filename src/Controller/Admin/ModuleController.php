<?php

namespace App\Controller\Admin;

use App\Entity\Module\Module;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;
use App\Exception\ApiException;
use App\Manager\ModuleManager;
use App\Service\Module\ModuleService;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ModuleController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce module n'existe pas.";

    #[Rest\Get('/modules')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $modules = $this->em->getRepository(Module::class)->findAllForAdmin($filters);

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

    #[Rest\Post('/modules/{moduleId}/active', requirements: ['moduleId' => '\d+'])]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function active(Request $request, ParamFetcher $paramFetcher, int $moduleId): View
    {
        $module = $this->em->getRepository(Module::class)->findOneForAdmin($moduleId);
        if (null === $module) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;

        $deleteFolder = $filters['deleteFolder'] ?? null;
        if ($deleteFolder) {
            $event = new CrudObjectInstantiatedEvent($module, 'delete');
            $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

            $moduleName = $module->getName();
            $moduleId = $module->getId();

            $this->em->remove($module);
            $this->em->flush();

            $this->log->log(0, 0, 'Deleted object.', Module::class, $moduleId);

            ModuleService::callConfig($module->getName(), 'uninstall');
            ModuleService::deleteModuleFolder($moduleName);

            return $this->view(null, Response::HTTP_OK);
        }

        $event = new CrudObjectInstantiatedEvent($module, 'edit');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $module->setActive(!$module->isActive());

        $event = new CrudObjectValidatedEvent($module);
        $this->ed->dispatch($event, CrudObjectValidatedEvent::NAME);

        $this->em->persist($module);
        $this->em->flush();

        $this->log->log(0, 0, 'Updated object.', Module::class, $module->getId());

        $uninstall = $filters['uninstall'] ?? null;
        if ($uninstall) {
            ModuleService::callConfig($module->getName(), 'uninstall');
        } else if (!$module->isActive()) {
            ModuleService::callConfig($module->getName(), 'disable');
        } else {
            ModuleService::callConfig($module->getName(), 'install');
        }

        shell_exec('php ../bin/console cache:clear');
        shell_exec('php ../bin/console doctrine:schema:update --force');

        return $this->view($module, Response::HTTP_OK);
    }
}