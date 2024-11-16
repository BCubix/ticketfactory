<?php

namespace App\Controller\Admin;

use App\Entity\Addon\Module;
use App\Exception\ApiException;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Rest\Route('/api')]
class ModuleController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce module n'existe pas.";

    #[Rest\Get('/modules')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_module_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;

        $modules = $this->mf->get('module')->getAll($filters);

        return $this->view($modules, Response::HTTP_OK);
    }

    #[Rest\Get('/modules/{moduleId}', requirements: ['moduleId' => '\d+'])]
    #[IsGranted('ROLE_MODULE_READ')]
    #[Rest\View(serializerGroups: ['a_all', 'a_module_one'])]
    public function getOne(Request $request, int $moduleId): View
    {
        $module = $this->em->getRepository(Module::class)->findOneForAdmin($moduleId);
        if (is_null($module)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        return $this->view($module, Response::HTTP_OK);
    }

    #[Rest\Post('/modules/{moduleName}/active', requirements: ['moduleName' => '.+'])]
    #[IsGranted('ROLE_MODULE_EDIT')]
    #[Rest\View(serializerGroups: ['a_all', 'a_module_one'])]
    public function active(Request $request, string $moduleName): View
    {
        $actionStr = $request->get('action');
        $action = ($actionStr !== null ? intval($actionStr) : Module::ACTION_INSTALL);

        $this->em->getConnection()->beginTransaction();

        try {
            $module = $this->mf->get('module')->active($moduleName, $action);

            $messageState = [
                Module::ACTION_INSTALL => "Updated",
                Module::ACTION_DISABLE => "Updated",
                Module::ACTION_UNINSTALL => "Uninstalled",
                Module::ACTION_UNINSTALL_DELETE => "removed",
            ];

            if (null !== $module) {
                $this->log->log(0, 0, $messageState[intval($actionStr)] . " module." , Module::class, $module->getId());
            }
        } finally {
            if ($this->em->getConnection()->isTransactionActive()) {
                $this->em->getConnection()->rollBack();
            }
        }

        return $this->view($module, Response::HTTP_OK);
    }

    #[Rest\Get('/modules/module-image/{moduleName}', requirements: ['moduleName' => '.+'])]
    #[IsGranted('ROLE_MODULE_READ')]
    public function getModuleImage(Request $request, string $moduleName)
    {
        $result = $this->mf->get("module")->getImage($moduleName);

        if (null !== $result) {
            $result->headers->set('Content-Type', 'image/png');
            $result->setContentDisposition(
                ResponseHeaderBag::DISPOSITION_INLINE,
                'module' . $moduleName . 'image.png'
            );

            return $result;
        }

        return new JsonResponse(null, 200);
    }
}
