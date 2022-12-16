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

        $modules = $this->ms->getAllInDisk();
        $hooks = $this->em->getRepository(Hook::class)->findAllHooksForAdmin();

        foreach ($hooks as $hook) {
            for ($i = 0; $i < count($result); ++$i) {
                if ($result[$i]['name'] === $hook->getName()) {
                    break;
                }
            }

            if ($i === count($result)) {
                $result[] = [
                    'name' => $hook->getName(),
                    'modules' => [],
                ];
            }

            $module = $hook->getModule();
            if (null !== $module) {
                $moduleName = $module->getName();
                $r = array_filter($modules, function ($moduleInfos) use ($moduleName) {
                    return $moduleInfos['name'] === $moduleName;
                });

                if (count($r) !== 1) {
                    dd($moduleName);
                }
                $module = [ ...array_pop($r), 'position' => $hook->getPosition()];
                $result[$i]['modules'][] = $module;
            }
        }

        for ($i = 0; $i < count($result); ++$i) {
            usort($result[$i]['modules'], function ($a, $b) {
                if ($a['position'] === $b['position']) {
                    return 0;
                }
                return $a['position'] < $b['position'] ? -1 : 1;
            });
        }

        return $result;
    }

    #[Rest\Post('/hooks/{hookName}/disable', requirements: ['hookName' => '.+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function disable(Request $request, string $hookName): View
    {
        $moduleName = $request->get('module-name');
        $module = $this->em->getRepository(Module::class)->findOneByNameForAdmin($moduleName);
        if (null === $module) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le module " . $moduleName . " n'existe pas.");
        }

        $removeHook = $this->em->getRepository(Hook::class)->findOneByNameAndModuleNameForAdmin($hookName, $moduleName);
        if (null === $removeHook) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Ce hook n'existe pas.");
        }

        $removeHookPosition = $removeHook->getPosition();

        $hooks = $this->em->getRepository(Hook::class)->findAllByNameForAdmin($hookName);
        foreach ($hooks as $hook) {
            $position = $hook->getPosition();
            if ($position > $removeHookPosition) {
                $hook->setPosition($position - 1);
                $this->em->persist($hook);
            }
        }

        $this->em->remove($removeHook);
        $this->em->flush();

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    #[Rest\Post('/hooks/{hookName}', requirements: ['hookName' => '.+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function update(Request $request, string $hookName): View
    {
        $hooks = $this->em->getRepository(Hook::class)->findAllByNameForAdmin($hookName);
        if (null === $hooks) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Ce hook n'existe pas.");
        }

        $srcPosition = $request->get('src');
        $destPosition = $request->get('dest');

        if (null === $srcPosition || null === $destPosition) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La requête n'a pas les informations requis.");
        }

        if ($srcPosition > $destPosition) {
            for ($i = $destPosition; $i < $srcPosition; ++$i) {
                $hooks[$i]->setPosition($i + 1);
                $this->em->persist($hooks[$i]);
            }
        } else {
            for ($i = $srcPosition + 1; $i < $destPosition + 1; ++$i) {
                $hooks[$i]->setPosition($i - 1);
                $this->em->persist($hooks[$i]);
            }
        }
        $hooks[$srcPosition]->setPosition($destPosition);
        $this->em->persist($hooks[$srcPosition]);

        $this->em->flush();

        return $this->view($this->getAllHookModule(), Response::HTTP_OK);
    }
}