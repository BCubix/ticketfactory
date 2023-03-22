<?php

namespace App\Controller\Admin;

use App\Entity\Hook\Hook;
use App\Entity\Module\Module;
use App\Exception\ApiException;
use App\Manager\HookManager;
use App\Manager\LanguageManager;
use App\Service\Hook\HookService;
use App\Service\Logger\Logger;
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
    private $hm;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        HookManager $hm,
        LanguageManager $lm
    ) {
        parent::__construct($em, $se, $fec, $log, $hs, $lm);

        $this->hm = $hm;
    }

    #[Rest\Get('/hooks')]
    #[Rest\View(serializerGroups: ['a_all', 'a_hook_all'])]
    public function getAll(Request $request): View
    {
        $result = $this->hm->getAllModulesByHook();
        return $this->view($result, Response::HTTP_OK);
    }

    #[Rest\Post('/hooks')]
    #[Rest\View(serializerGroups: ['a_all', 'a_hook_one'])]
    public function add(Request $request): View
    {
        $rq = $request->request->all();
        $hookName = $rq['hookName'];
        $moduleName = $rq['moduleName'];

        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module " . $moduleName . " n'existe pas.");
        }

        $hook = $this->em->getRepository(Hook::class)->findOneByNameAndModuleNameForAdmin($hookName, $moduleName);
        if (null !== $hook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le hook " . $hookName . " (module: $moduleName) existe déjà.");
        }

        $hook = new Hook();
        $hook->setName($hookName);
        $hook->setModule($module);
        $hook->setPosition($this->hs->getPosition($hookName));

        $this->em->persist($hook);
        $this->em->flush();

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

        return $this->view($this->hm->getAllModulesByHook(), Response::HTTP_OK);
    }
}