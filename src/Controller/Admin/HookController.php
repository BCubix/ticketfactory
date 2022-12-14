<?php

namespace App\Controller\Admin;

use App\Entity\Hook\Hook;
use App\Entity\Module\Module;
use App\Exception\ApiException;
use App\Service\Hook\HookService;
use App\Service\Logger\Logger;
use App\Service\ModuleTheme\Service\ModuleService;
use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class HookController extends AdminController
{
    private $ms;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        ModuleService $ms
    ) {
        parent::__construct($em, $se, $fec, $log, $hs);

        $this->ms = $ms;
    }

    #[Rest\Get('/hooks')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request): View
    {
        $result = $this->getAllHookModule();
        return $this->view($result, Response::HTTP_OK);
    }

    function getAllHookModule(): array
    {
        $result = [];

        $hooks = $this->em->getRepository(Hook::class)->findAllHookModuleForAdmin();
        foreach ($hooks as $hook) {
            $modules = [];
            foreach ($hook->getModules() as $module) {
                $moduleName = $module->getName();
                $modules[] = $this->ms->getConfig($moduleName)
                    + $this->ms->getImage($moduleName);
            }

            $result[] = [
                'name' => $hook->getName(),
                'modules' => $modules,
            ];
        }

        return $result;
    }

    #[Rest\Post('/hooks/{hookName}/disable', requirements: ['hookName' => '.+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function disable(Request $request, string $hookName): View
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Ce hook n'existe pas.");
        }

        $moduleName = $request->get('module-name');
        if (null === $moduleName) {
            return $this->view(null, Response::HTTP_NO_CONTENT);
        }
        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module " . $moduleName . " n'existe pas.");
        }

        $hook->removeModule($module);

        $this->em->persist($hook);
        $this->em->flush();

        return $this->view($hook, Response::HTTP_NO_CONTENT);
    }

    #[Rest\Post('/hooks/{hookName}', requirements: ['hookName' => '.+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function update(Request $request, string $hookName): View
    {
        $hook = $this->em->getRepository(Hook::class)->findOneByNameForAdmin($hookName);
        if (null === $hook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Ce hook n'existe pas.");
        }

        $hookData = $request->request->all();

        $modules = [];
        foreach ($hookData['modules'] as $module) {
            $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($module['name']);
            if (null === $module) {
                throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module " . $module['name'] . " n'existe pas.");
            }
            $modules[] = $module;
        }

        $modulesNameBefore = array_map(function ($module) {
            return $module->getName();
        }, $hook->getModules()->toArray());

        $modulesNameAfter = array_map(function ($module) {
            return $module->getName();
        }, $modules);

        if (array_diff($modulesNameBefore, $modulesNameAfter)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Les modules ne correspondent pas aux modules du hook.");
        }

        foreach ($hook->getModules() as $module) {
            $hook->removeModule($module);
        }

        foreach ($modules as $module) {
            $hook->addModule($module);
        }

        $this->em->persist($hook);
        $this->em->flush();

        return $this->view($this->getAllHookModule(), Response::HTTP_OK);
    }
}