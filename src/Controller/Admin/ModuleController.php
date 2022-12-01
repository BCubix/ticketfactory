<?php

namespace App\Controller\Admin;

use App\Entity\Module\Module;
use App\Exception\ApiException;
use App\Manager\ModuleManager;
use App\Service\Logger\Logger;
use App\Service\ModuleTheme\Service\ModuleService;
use App\Utils\FormErrorsCollector;
use App\Utils\Tree;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ModuleController extends AdminController
{
    protected const NOT_FOUND_MESSAGE = "Ce module n'existe pas.";

    private $mm;
    private $ms;

    public function __construct(
        EventDispatcherInterface $ed,
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        ModuleManager $mm,
        ModuleService $ms
    ) {
        parent::__construct($ed, $em, $se, $fec, $log);

        $this->mm = $mm;
        $this->ms = $ms;
    }

    #[Rest\Get('/modules')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $objects = $this->em->getRepository(Module::class)->findAllForAdmin($filters);

        // Add modules not in base so not installed
        $modulesPath = glob($this->ms->getDir() . '/*', GLOB_ONLYDIR);
        foreach ($modulesPath as $modulePath) {
            $moduleName = basename($modulePath);

            $result = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
            if (!$result) {
                $objects['results'][] = [ 'name' => $moduleName ];
                $objects['total']++;
            }
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
        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            if (!is_dir($this->ms->getDir() . '/' . $moduleName)) {
                throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
            }

            $tree = Tree::build($this->ms->getDir() . '/' . $moduleName);
            $tree = [ $moduleName => $tree ];
            $this->ms->checkTree($tree);

            $this->mm->createNewModule($moduleName);

            return $this->view(null, Response::HTTP_OK);
        }

        $actionStr = $request->get('action');
        $action = $actionStr !== null ? intval($actionStr) : Module::ACTION_INSTALL;

        $this->mm->doAction($module, $action);

        return $this->view($module, Response::HTTP_OK);
    }
}