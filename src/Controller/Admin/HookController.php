<?php

namespace App\Controller\Admin;

use App\Entity\Hook\Hook;
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

        return $this->view($result, Response::HTTP_OK);
    }
}