<?php

namespace App\Controller\Admin;

use App\Entity\Module\Module;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;
use App\Exception\ApiException;
use App\Service\Module\ModuleService;
use App\Utils\System;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ModuleController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce module n'existe pas.";

    private const ACTION_DISABLE = 0;
    private const ACTION_UNINSTALL = 1;
    private const ACTION_UNINSTALL_DELETE = 2;

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
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function active(Request $request, ModuleService $ms, int $moduleId): View
    {
        $module = $this->em->getRepository(Module::class)->findOneForAdmin($moduleId);
        if (null === $module) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $actionStr = $request->get('action');
        $action = $actionStr !== null ? intval($actionStr) : null;

        if ($action === self::ACTION_UNINSTALL_DELETE) {
            $event = new CrudObjectInstantiatedEvent($module, 'delete');
            $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

            $moduleName = $module->getName();
            $moduleId = $module->getId();

            $this->em->remove($module);
            $this->em->flush();

            $this->log->log(0, 0, 'Deleted object.', Module::class, $moduleId);

            $ms->callConfig($module->getName(), 'uninstall');

            System::rmdir($ms->getDir() . '/' . $moduleName);

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

        if ($action === static::ACTION_UNINSTALL) {
            $ms->callConfig($module->getName(), 'uninstall');
        } else if ($action === static::ACTION_DISABLE) {
            $ms->callConfig($module->getName(), 'disable');
        } else {
            $ms->callConfig($module->getName(), 'install');
        }

        $ms->clear();

        return $this->view($module, Response::HTTP_OK);
    }
}