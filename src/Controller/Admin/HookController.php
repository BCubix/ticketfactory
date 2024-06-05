<?php

namespace App\Controller\Admin;

use App\Entity\Addon\Module;
use App\Entity\Hook\Hook;
use App\Exception\ApiException;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class HookController extends AdminController
{
    #[Rest\Get('/hooks')]
    #[Rest\View(serializerGroups: ['a_all', 'a_hook_all'])]
    public function getAll(Request $request): View
    {
        $result = $this->hm->getAllModulesByHook();
        return $this->view($result, Response::HTTP_OK);
    }

    #[Rest\Get('/hooks/displaylist')]
    #[Rest\View(serializerGroups: ['a_all', 'a_hook_all'])]
    public function getAllDisplayHooks(Request $request): View
    {
        $result = $this->hm->getAllDisplayHook();
        return $this->view($result, Response::HTTP_OK);
    }

    #[Rest\Post('/hooks')]
    #[Rest\View(serializerGroups: ['a_all', 'a_hook_one'])]
    public function add(Request $request): View
    {
        $rq = $request->request->all();
        $hookName = $rq['hookName'];
        $moduleName = $rq['moduleName'];
        $displayHook = $rq['displayHook'];

        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module " . $moduleName . " n'existe pas.");
        }

        $hook = $this->em->getRepository(Hook::class)->findOneByNameAndModuleNameForAdmin($hookName, $moduleName);
        if (null !== $hook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le hook " . $hookName . " (module: $moduleName) existe déjà.");
        }

        $hook = new Hook();


        $moduleInstance = $this->mf->get('module')->importModuleInstance($module->getName());
        $configModule = $moduleInstance->getConfiguration();
        $name = null;
        if ($configModule["hooks"]) {
            foreach ($configModule["hooks"] as $key => $value) {
                if ($value === $hookName) {
                    $name = $key;
                    break;
                }
            }
        }
        if ($displayHook === '' || $displayHook === null) {
            $hook->setName($name);
        } else {
            $hook->setDisplayHook($name);
            $hook->setName($displayHook);
        }
        $hook->setModule($module);
        $hook->setClassName($hookName);
        $hook->setPosition($this->hm->getPosition($hookName));

        $this->em->persist($hook);
        $this->em->flush();

        $this->log->log(0, 0, 'Created object.', Hook::class, $hook->getId());

        return $this->view($hook, Response::HTTP_OK);
    }

    #[Rest\Post('/hooks/{hookName}/disable', requirements: ['hookName' => '.+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_hook_one'])]
    public function disable(Request $request, string $hookName): View
    {
        $moduleName = $request->get('module-name');
        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module " . $moduleName . " n'existe pas.");
        }

        $removeHook = $this->em->getRepository(Hook::class)->findOneByNameAndModuleNameForAdmin($hookName, $moduleName);
        if (null === $removeHook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le hook $hookName (module: $moduleName) n'existe pas.");
        }

        $this->hm->disableHook($removeHook);
        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', Hook::class, $removeHook->getId());

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    #[Rest\Post('/hooks/{hookName}', requirements: ['hookName' => '.+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_hook_one'])]
    public function update(Request $request, string $hookName): View
    {
        $hooks = $this->em->getRepository(Hook::class)->findAllByNameForAdmin($hookName);
        if (null === $hooks) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Ce hook n'existe pas.");
        }

        $srcPosition = $request->get('src');
        $destPosition = $request->get('dest');

        if (null === $srcPosition || null === $destPosition) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La requête n'a pas les informations requises.");
        }

        $this->hm->updateHook($hooks, $srcPosition, $destPosition);
        $this->em->flush();

        $this->log->log(0, 0, 'Updated object from position ' . $srcPosition . ' to ' . $destPosition . '.', Hook::class, $hooks[$srcPosition]->getId());

        return $this->view($this->hm->getAllModulesByHook(), Response::HTTP_OK);
    }
}
